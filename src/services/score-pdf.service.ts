import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface ExamBatchConfig {
  examId: string;
  examTitle: string;
  subjectName: string;
  gradeLabel: string;
  schoolName: string;
  campusKey: string;
  totalMarks: number;
  durationMins: number;
  students: Array<{
    id: string;
    fullName: string;
    rollNumber: string;
  }>;
}

export class ScorePdfService {
  /**
   * Generates a multi-page, vectorized physical exam booklet with 2D QR corner anchors
   * and returns the binary PDF buffer.
   */
  static async generateBatchPdf(config: ExamBatchConfig): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 36, bottom: 36, left: 36, right: 36 },
          autoFirstPage: false
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Generate booklet for each student
        for (let i = 0; i < config.students.length; i++) {
          const student = config.students[i];
          await this.renderStudentBooklet(doc, config, student);
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates physical exam booklet batch and persists to static public/renders/ directory
   */
  static async generateAndSaveBatchPdf(
    config: ExamBatchConfig,
    outputPath: string
  ): Promise<{ buffer: Buffer; filePath: string; fileSizeBytes: number; totalPages: number }> {
    const buffer = await this.generateBatchPdf(config);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, buffer);
    return {
      buffer,
      filePath: outputPath,
      fileSizeBytes: buffer.length,
      totalPages: config.students.length * 2
    };
  }

  private static async renderStudentBooklet(
    doc: PDFKit.PDFDocument,
    config: ExamBatchConfig,
    student: { id: string; fullName: string; rollNumber: string }
  ) {
    // -------------------------------------------------------------
    // PAGE 1: COVER PAGE & OMR OBJECTIVE SHEET
    // -------------------------------------------------------------
    doc.addPage();
    await this.renderQrAnchors(doc, config, student, 1);

    // School & Exam Header
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(config.schoolName.toUpperCase(), 70, 50, { align: 'center' });

    doc
      .fillColor('#0D9488')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('ACHARIYA EVALUATOR · SCORE EXAMINATION SUITE', 70, 72, { align: 'center' });

    doc
      .fillColor('#334155')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(config.examTitle, 70, 90, { align: 'center' });

    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(9)
      .text(
        `${config.gradeLabel} · ${config.subjectName} · Max Marks: ${config.totalMarks} · Duration: ${config.durationMins} Mins`,
        70,
        105,
        { align: 'center' }
      );

    // Student Identification Box
    doc
      .rect(50, 125, 495, 48)
      .lineWidth(1)
      .strokeColor('#CBD5E1')
      .fillColor('#F8FAFC')
      .fillAndStroke();

    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('CANDIDATE NAME:', 65, 135)
      .font('Helvetica-Bold')
      .text(student.fullName.toUpperCase(), 175, 135);

    doc
      .font('Helvetica-Bold')
      .text('ROLL NUMBER:', 65, 152)
      .font('Courier-Bold')
      .fontSize(11)
      .fillColor('#0D9488')
      .text(student.rollNumber, 175, 151);

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#64748B')
      .text('BOOKLET SET: A', 420, 135)
      .text('SHEET: 01 / 02', 420, 152);

    // SECTION A: OMR BUBBLE MATRIX (15 Questions)
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('SECTION A: OMR OBJECTIVE EVALUATION (15 MARKS · 1 MARK EACH)', 50, 190);

    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(8)
      .text('Fill completely using blue/black ballpoint pen. High-speed optical scanner will process this zone.', 50, 204);

    // Draw OMR 3-column Grid
    const omrStartY = 225;
    for (let q = 1; q <= 15; q++) {
      const col = Math.floor((q - 1) / 5); // 0, 1, 2
      const row = (q - 1) % 5;
      const x = 50 + col * 165;
      const y = omrStartY + row * 28;

      // Question Number
      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(`Q${q.toString().padStart(2, '0')}`, x, y + 2);

      // Bubbles A, B, C, D
      const options = ['A', 'B', 'C', 'D'];
      for (let optIdx = 0; optIdx < 4; optIdx++) {
        const bubbleX = x + 35 + optIdx * 30;
        const bubbleY = y + 7;

        doc
          .circle(bubbleX, bubbleY, 8)
          .lineWidth(0.8)
          .strokeColor('#0D9488')
          .stroke();

        doc
          .fillColor('#0F766E')
          .font('Helvetica-Bold')
          .fontSize(7)
          .text(options[optIdx], bubbleX - 2.5, bubbleY - 4);
      }
    }

    // SECTION B: SHORT HANDWRITTEN RESPONSES (Crop Zone for OCR)
    const secBY = 385;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('SECTION B: SHORT HANDWRITTEN RESPONSES (CROP ZONE)', 50, secBY);

    // Question 16 Box
    doc
      .fillColor('#334155')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Q16. State the First Law of Energy Conservation and give one biological example. (5 Marks)', 50, secBY + 16);

    // OCR Bounding Box Container with Corner Calibration Crosshairs
    doc
      .rect(50, secBY + 32, 495, 120)
      .lineWidth(1)
      .strokeColor('#94A3B8')
      .fillColor('#FFFFFF')
      .fillAndStroke();

    // Subtle OCR guide lines inside box
    for (let l = 1; l <= 4; l++) {
      doc
        .moveTo(55, secBY + 32 + l * 24)
        .lineTo(540, secBY + 32 + l * 24)
        .lineWidth(0.5)
        .dash(3, { space: 3 })
        .strokeColor('#E2E8F0')
        .stroke()
        .undash();
    }

    doc
      .fillColor('#94A3B8')
      .font('Courier')
      .fontSize(7)
      .text('[ OCR BOUNDING BOX: CROP_Q16_STUDENT_HANDWRITING ]', 55, secBY + 140);

    // -------------------------------------------------------------
    // PAGE 2: DIAGRAM & LONG RESPONSE OCR BOUNDING REGION
    // -------------------------------------------------------------
    doc.addPage();
    await this.renderQrAnchors(doc, config, student, 2);

    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('SECTION C: EXPERIMENTAL SYNTHESIS & DIAGRAM AREA (SHEET 02)', 50, 50);

    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(9)
      .text('Q17. Draw and label the chloroplast organelle showing thylakoid disks and stroma. (10 Marks)', 50, 66);

    // Large Diagram Box with Optical Corner Markers
    doc
      .rect(50, 85, 495, 300)
      .lineWidth(1)
      .strokeColor('#94A3B8')
      .fillColor('#FFFFFF')
      .fillAndStroke();

    doc
      .fillColor('#94A3B8')
      .font('Courier')
      .fontSize(8)
      .text('[ OCR DIAGRAM MATRIX: BOUND_ZONE_Q17_VECTOR_RASTER ]', 60, 370);

    // Section D: Reflection & Teacher Evaluation Block
    doc
      .rect(50, 410, 495, 90)
      .lineWidth(1)
      .strokeColor('#CBD5E1')
      .fillColor('#F8FAFC')
      .fillAndStroke();

    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('FOR EVALUATOR USE ONLY (AI OCR + FACULTY VERIFICATION)', 60, 422);

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#475569')
      .text('Section A (OMR): _____ / 15     Section B (Written): _____ / 20     Section C (Diagram): _____ / 15', 60, 442)
      .text('Composite Score: _____ / 50     Evaluator Signature: _________________________', 60, 465);
  }

  /**
   * Generates and embeds high-resolution 2D QR anchors on the corners of the sheet
   */
  private static async renderQrAnchors(
    doc: PDFKit.PDFDocument,
    config: ExamBatchConfig,
    student: { id: string; fullName: string; rollNumber: string },
    pageNumber: number
  ) {
    // Structured optical QR payload for automated scanner ingestion
    const qrPayload = JSON.stringify({
      aid: 'ACH',
      eid: config.examId,
      sid: student.id,
      roll: student.rollNumber,
      p: pageNumber,
      set: 'A',
      v: '2.0'
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 120,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    });

    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(qrBase64, 'base64');

    // Top-Left Optical QR Anchor
    doc.image(qrBuffer, 20, 20, { width: 44, height: 44 });

    // Top-Right Optical QR Anchor
    doc.image(qrBuffer, 530, 20, { width: 44, height: 44 });

    // Bottom-Left Alignment Marker
    doc.image(qrBuffer, 20, 775, { width: 44, height: 44 });

    // Bottom-Right Optical QR Anchor
    doc.image(qrBuffer, 530, 775, { width: 44, height: 44 });
  }
}

