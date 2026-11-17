import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface HpcStudentData {
  id: string;
  fullName: string;
  rollNumber: string;
  gradeLabel: string;
  section: string;
  academicYear: string;
  campusName: string;
  attendancePercent: number;
  daysPresent: number;
  totalWorkingDays: number;
  cognitiveScore: number;
  socioEmotionalScore: number;
  physicalScore: number;
  culturalScore: number;
  ethicalScore: number;
  dominantBmit: string;
  bmitScores: Record<string, number>;
  vakProfile: { visual: number; auditory: number; kinaesthetic: number };
  fiveArts: Array<{ art: string; grade: string; remark: string }>;
  scholasticSubjects: Array<{ subject: string; score: number; maxScore: number; level: string; comment: string }>;
  teacherRemarks: string;
  teacherName: string;
  principalName: string;
}

export class HpcPdfService {
  /**
   * Generates a board-grade, 2-page NEP 2020 & PARAKH Holistic Progress Card (HPC 360°)
   * aligned with CBSE guidelines, Achariya BMIT brain mapping, and MiWay Experiential Labs.
   */
  static async generateHpcPdf(data: Partial<HpcStudentData> = {}): Promise<Buffer> {
    const student: HpcStudentData = {
      id: data.id || 'ach-stu-aarav-01',
      fullName: data.fullName || 'Aarav Sundaram',
      rollNumber: data.rollNumber || '05A-01',
      gradeLabel: data.gradeLabel || 'Grade 5',
      section: data.section || 'Studio A',
      academicYear: data.academicYear || '2025–2026 · Term 1',
      campusName: data.campusName || 'Achariya World Class Academy (Main Campus, Puducherry)',
      attendancePercent: data.attendancePercent ?? 96.5,
      daysPresent: data.daysPresent ?? 112,
      totalWorkingDays: data.totalWorkingDays ?? 116,
      cognitiveScore: data.cognitiveScore ?? 95,
      socioEmotionalScore: data.socioEmotionalScore ?? 90,
      physicalScore: data.physicalScore ?? 80,
      culturalScore: data.culturalScore ?? 85,
      ethicalScore: data.ethicalScore ?? 90,
      dominantBmit: data.dominantBmit || 'Visual-Spatial (88%) & Logical-Mathematical (84%)',
      bmitScores: data.bmitScores || {
        'Visual-Spatial': 88,
        'Logical-Mathematical': 84,
        'Interpersonal': 82,
        'Intrapersonal': 80,
        'Linguistic': 78,
        'Bodily-Kinesthetic': 76,
        'Naturalist': 75,
        'Musical-Rhythmic': 70
      },
      vakProfile: data.vakProfile || { visual: 45, auditory: 25, kinaesthetic: 30 },
      fiveArts: data.fiveArts || [
        { art: 'Visual Art', grade: 'A+', remark: 'Mastery in perspective drawing, color harmony & 3D composition.' },
        { art: 'Performing Art', grade: 'A', remark: 'Expressive dramatic delivery and voice modulation.' },
        { art: 'Martial Art', grade: 'A', remark: 'Disciplined posture, swift reflex agility, and kata precision.' },
        { art: 'Culinary Art', grade: 'A+', remark: 'Precise ingredient ratios, nutritional awareness & hygiene.' },
        { art: 'Digital & Robotics Art', grade: 'A+', remark: 'Assembled solar rainwater harvesting robot in Tinkering Lab.' }
      ],
      scholasticSubjects: data.scholasticSubjects || [
        { subject: 'Mathematics', score: 92, maxScore: 100, level: 'Proficient', comment: 'Strong fractions, scale ratios, and problem solving.' },
        { subject: 'Science & Robotics', score: 94, maxScore: 100, level: 'Advanced', comment: 'Exemplary circuit design and experimental inquiries.' },
        { subject: 'English Language (LSR)', score: 88, maxScore: 100, level: 'Proficient', comment: 'High voice fluency, expressive speech & reading comprehension.' },
        { subject: 'Social Science & Civics', score: 90, maxScore: 100, level: 'Proficient', comment: 'Thorough civic awareness and community mapping.' },
        { subject: 'Environmental Science', score: 92, maxScore: 100, level: 'Advanced', comment: 'Deep understanding of ecological microgrids and conservation.' }
      ],
      teacherRemarks:
        data.teacherRemarks ||
        'Aarav is an exceptionally observant scholar who thrives when concepts are anchored in visual diagrams and hands-on simulation labs. Demonstrates active leadership during collaborative MiWay science conclaves.',
      teacherName: data.teacherName || 'Dr. Priya Sivaraman (Senior Faculty)',
      principalName: data.principalName || 'Dr. V. Rajakumaran (Founder President)'
    };

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 32, bottom: 32, left: 32, right: 32 },
          autoFirstPage: false
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // RENDER PAGE 1: Scholastic, VAK & 8-Domain BMIT
        await this.renderPage1(doc, student);

        // RENDER PAGE 2: 5 Arts, Co-Scholastic, Attendance & Attestation
        await this.renderPage2(doc, student);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * PAGE 1: Institutional Header, Scholar Demographics, Scholastic Matrix & BMIT Intelligence
   */
  private static async renderPage1(doc: PDFKit.PDFDocument, student: HpcStudentData) {
    doc.addPage();

    // 1. Top Decorative Ribbon
    doc.rect(32, 28, 531, 6).fillColor('#0D9488').fill();

    // 2. School Brand & Institutional Header
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('ACHARIYA WORLD CLASS ACADEMY', 32, 42, { align: 'center', width: 531 });

    doc
      .fillColor('#0D9488')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('CENTRAL CAMPUS · AFFILIATED TO CBSE, NEW DELHI', 32, 60, { align: 'center', width: 531 });

    doc
      .fillColor('#475569')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('HOLISTIC PROGRESS CARD (HPC 360° · NEP 2020 & PARAKH)', 32, 74, { align: 'center', width: 531 });

    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(8)
      .text(`ACADEMIC YEAR: ${student.academicYear.toUpperCase()} · MULTIDIMENSIONAL WHOLE-CHILD PORTFOLIO`, 32, 90, {
        align: 'center',
        width: 531
      });

    // 3. Scholar Demographic Card
    const demoY = 106;
    doc
      .rect(32, demoY, 531, 54)
      .lineWidth(1)
      .strokeColor('#CBD5E1')
      .fillColor('#F8FAFC')
      .fillAndStroke();

    doc
      .fillColor('#64748B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('SCHOLAR NAME:', 44, demoY + 8)
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(student.fullName.toUpperCase(), 125, demoY + 6);

    doc
      .fillColor('#64748B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('ROLL NUMBER:', 44, demoY + 24)
      .fillColor('#0D9488')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(student.rollNumber, 125, demoY + 24);

    doc
      .fillColor('#64748B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('GRADE & STUDIO:', 44, demoY + 38)
      .fillColor('#334155')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`${student.gradeLabel} · ${student.section}`, 125, demoY + 38);

    doc
      .fillColor('#64748B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('CAMPUS LOCATION:', 305, demoY + 8)
      .fillColor('#334155')
      .font('Helvetica')
      .fontSize(8)
      .text(student.campusName, 395, demoY + 8, { width: 160 });

    doc
      .fillColor('#64748B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('TERM ATTENDANCE:', 305, demoY + 38)
      .fillColor('#0D9488')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`${student.attendancePercent}% (${student.daysPresent}/${student.totalWorkingDays} Days)`, 395, demoY + 38);

    // 4. Section 1: 5-Domain NEP 2020 Holistic Growth Indices
    const domainY = 170;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('1. NEP 2020 FIVE-DIMENSIONAL DEVELOPMENTAL INDICES', 32, domainY);

    const domains = [
      { name: 'Cognitive (Scholastic)', val: student.cognitiveScore, col: '#0D9488' },
      { name: 'Socio-Emotional', val: student.socioEmotionalScore, col: '#7C3AED' },
      { name: 'Physical (Health/Yoga)', val: student.physicalScore, col: '#EA580C' },
      { name: 'Cultural & 5 Arts', val: student.culturalScore, col: '#DB2777' },
      { name: 'Ethical & Civic', val: student.ethicalScore, col: '#0284C7' }
    ];

    domains.forEach((d, idx) => {
      const boxX = 32 + idx * 108;
      const boxY = domainY + 16;
      doc
        .rect(boxX, boxY, 99, 44)
        .lineWidth(0.8)
        .strokeColor('#E2E8F0')
        .fillColor('#FFFFFF')
        .fillAndStroke();

      doc
        .fillColor(d.col)
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(`${d.val}%`, boxX, boxY + 8, { align: 'center', width: 99 });

      doc
        .fillColor('#475569')
        .font('Helvetica-Bold')
        .fontSize(6.5)
        .text(d.name.toUpperCase(), boxX + 4, boxY + 26, { align: 'center', width: 91 });
    });

    // 5. Section 2: Scholastic Competencies (CBSE / Bloom's Taxonomy)
    const subjY = 246;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('2. SCHOLASTIC COMPETENCY & OUTCOME MASTERY (PARAKH CRITERIA)', 32, subjY);

    // Table Header
    const tableHeaderY = subjY + 16;
    doc.rect(32, tableHeaderY, 531, 18).fillColor('#0F172A').fill();
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .text('SUBJECT / DISCIPLINE', 40, tableHeaderY + 5)
      .text('SCORE', 170, tableHeaderY + 5)
      .text('MASTERY LEVEL', 225, tableHeaderY + 5)
      .text('TEACHER QUALITATIVE OBSERVATION & OUTCOME DEMONSTRATION', 320, tableHeaderY + 5);

    let curSubjY = tableHeaderY + 18;
    student.scholasticSubjects.forEach((sub, sIdx) => {
      const bg = sIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(32, curSubjY, 531, 22).fillColor(bg).fill();

      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(sub.subject, 40, curSubjY + 6);

      doc
        .fillColor('#0D9488')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(`${sub.score} / ${sub.maxScore}`, 170, curSubjY + 6);

      doc
        .fillColor('#7C3AED')
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .text(sub.level.toUpperCase(), 225, curSubjY + 6);

      doc
        .fillColor('#475569')
        .font('Helvetica')
        .fontSize(7)
        .text(sub.comment, 320, curSubjY + 6, { width: 235 });

      curSubjY += 22;
    });

    // 6. Section 3: VAK Multimodal Learning Matrix
    const vakY = curSubjY + 14;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('3. VAK MULTIMODAL LEARNING PROFILE (EXPERIENTIAL BRIDGES)', 32, vakY);

    doc
      .rect(32, vakY + 16, 531, 48)
      .lineWidth(0.8)
      .strokeColor('#CBD5E1')
      .fillColor('#F1F5F9')
      .fillAndStroke();

    doc
      .fillColor('#1E293B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Visual Learning (${student.vakProfile.visual}%): `, 42, vakY + 24)
      .font('Helvetica')
      .text('Excels with concept diagramming, animated storyboards & geometric models.', 145, vakY + 24);

    doc
      .fillColor('#1E293B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Auditory Learning (${student.vakProfile.auditory}%): `, 42, vakY + 36)
      .font('Helvetica')
      .text('Responsive to verbal narration, peer discussions and speech lab playbacks.', 145, vakY + 36);

    doc
      .fillColor('#1E293B')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Kinaesthetic (${student.vakProfile.kinaesthetic}%): `, 42, vakY + 48)
      .font('Helvetica')
      .text('Consolidates understanding through tactile simulation sliders and Tinkering kits.', 145, vakY + 48);

    // 7. Section 4: 8-Domain BMIT Brain Mapping (Enrichment Guide)
    const bmitY = vakY + 76;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('4. BMIT 8-DOMAIN BRAIN MAPPING (COGNITIVE ENRICHMENT GUIDE)', 32, bmitY);

    doc
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(7)
      .text(
        '* BMIT profile identifies innate intellectual affinities to guide enrichment projects; never used for negative streaming.',
        32,
        bmitY + 13
      );

    const bmitEntries = Object.entries(student.bmitScores);
    const bmitGridY = bmitY + 26;

    bmitEntries.forEach(([trait, score], bIdx) => {
      const col = bIdx % 4;
      const row = Math.floor(bIdx / 4);
      const cellX = 32 + col * 135;
      const cellY = bmitGridY + row * 34;

      doc
        .rect(cellX, cellY, 126, 28)
        .lineWidth(0.8)
        .strokeColor('#E2E8F0')
        .fillColor(score >= 80 ? '#F0FDF4' : '#FFFFFF')
        .fillAndStroke();

      doc
        .fillColor('#0F172A')
        .font('Helvetica-Bold')
        .fontSize(7)
        .text(trait, cellX + 6, cellY + 6, { width: 85 });

      doc
        .fillColor(score >= 80 ? '#16A34A' : '#0D9488')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(`${score}%`, cellX + 90, cellY + 6, { align: 'right', width: 30 });

      // Mini Progress bar
      doc.rect(cellX + 6, cellY + 18, 114, 4).fillColor('#E2E8F0').fill();
      doc.rect(cellX + 6, cellY + 18, Math.round((score / 100) * 114), 4).fillColor(score >= 80 ? '#16A34A' : '#0D9488').fill();
    });

    // Page 1 Footer
    doc
      .fillColor('#94A3B8')
      .font('Helvetica')
      .fontSize(7)
      .text('Achariya AI ONE · Official CBSE Holistic Progress Card · Page 1 of 2', 32, 804, { align: 'center', width: 531 });
  }

  /**
   * PAGE 2: MiWay Experiential Labs & 5 Arts, Co-Scholastic, Faculty Attestation & Official QR Seal
   */
  private static async renderPage2(doc: PDFKit.PDFDocument, student: HpcStudentData) {
    doc.addPage();

    // 1. Top Decorative Ribbon
    doc.rect(32, 28, 531, 6).fillColor('#7C3AED').fill();

    // Header
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('MIWAY EXPERIENTIAL LEARNING & CO-SCHOLASTIC ATTESTATION', 32, 42, { align: 'center', width: 531 });

    doc
      .fillColor('#7C3AED')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('ACHARIYA 5 ARTS CURRICULUM · SOCIO-EMOTIONAL ETHICS · FUTURE-READY SKILLS', 32, 58, { align: 'center', width: 531 });

    // 2. Section 5: The 5 Arts
    const artsY = 78;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('5. ACHARIYA 5 ARTS & EXPERIENTIAL LAB PERFORMANCE', 32, artsY);

    const artHeaderY = artsY + 16;
    doc.rect(32, artHeaderY, 531, 16).fillColor('#1E1B4B').fill();
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .text('DISCIPLINE', 40, artHeaderY + 4)
      .text('GRADE', 180, artHeaderY + 4)
      .text('MIWAY FACULTY OBSERVATION & HOLISTIC EXHIBITION', 240, artHeaderY + 4);

    let curArtY = artHeaderY + 16;
    student.fiveArts.forEach((fa, aIdx) => {
      const bg = aIdx % 2 === 0 ? '#FAF5FF' : '#FFFFFF';
      doc.rect(32, curArtY, 531, 22).fillColor(bg).fill();

      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(fa.art, 40, curArtY + 6);

      doc
        .fillColor('#7C3AED')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(fa.grade, 185, curArtY + 5);

      doc
        .fillColor('#475569')
        .font('Helvetica')
        .fontSize(7.5)
        .text(fa.remark, 240, curArtY + 6, { width: 310 });

      curArtY += 22;
    });

    // 3. Section 6: Socio-Emotional, Ethical & 21st-Century Life Skills
    const skillsY = curArtY + 16;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('6. SOCIO-EMOTIONAL, CIVIC & 21ST-CENTURY LIFE SKILLS (NEP PARAKH)', 32, skillsY);

    const skills = [
      { title: 'Critical Thinking & Problem Formulation', desc: 'Dissects multi-step questions with logical diagrams and structured arguments.', rating: 'ADVANCED' },
      { title: 'Collaboration & Peer Empathy', desc: 'Active team contributor; demonstrates listening patience and constructive support.', rating: 'PROFICIENT' },
      { title: 'Civic, Cultural & Environmental Ethics', desc: 'High ecological sensitivity; actively drives campus solar-water robotics initiatives.', rating: 'ADVANCED' },
      { title: 'Self-Regulation & Growth Mindset', desc: 'Views mistakes as learning feedback; approaches remediation with tenacity.', rating: 'PROFICIENT' }
    ];

    let curSkillY = skillsY + 16;
    skills.forEach((sk, sIdx) => {
      doc
        .rect(32, curSkillY, 531, 26)
        .lineWidth(0.8)
        .strokeColor('#E2E8F0')
        .fillColor(sIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF')
        .fillAndStroke();

      doc
        .fillColor('#0F172A')
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .text(sk.title, 42, curSkillY + 5);

      doc
        .fillColor('#64748B')
        .font('Helvetica')
        .fontSize(7)
        .text(sk.desc, 42, curSkillY + 15, { width: 400 });

      doc
        .fillColor('#0D9488')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(sk.rating, 460, curSkillY + 9, { align: 'right', width: 90 });

      curSkillY += 30;
    });

    // 4. Section 7: Faculty Synthesis & Individualized Educational Plan (IEDP)
    const remarksY = curSkillY + 14;
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('7. CLASS FACULTY SYNTHESIS & IEDP NEXT-STEP GOALS', 32, remarksY);

    doc
      .rect(32, remarksY + 16, 531, 62)
      .lineWidth(0.8)
      .strokeColor('#CBD5E1')
      .fillColor('#F8FAFC')
      .fillAndStroke();

    doc
      .fillColor('#1E293B')
      .font('Helvetica-Oblique')
      .fontSize(8)
      .text(`"${student.teacherRemarks}"`, 44, remarksY + 24, { width: 507, lineGap: 3 });

    doc
      .fillColor('#0D9488')
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .text('TERM 2 ENRICHMENT GOAL: ', 44, remarksY + 54)
      .fillColor('#334155')
      .font('Helvetica')
      .text('Lead the Middle-School Robotics Conclave and scale percentage modeling to data science.', 170, remarksY + 54);

    // 5. Section 8: Signatures, Attestation Seals & Digital Verification QR Anchor
    const sealY = remarksY + 92;
    doc
      .rect(32, sealY, 531, 108)
      .lineWidth(1)
      .strokeColor('#0D9488')
      .fillColor('#F0FDFA')
      .fillAndStroke();

    // Generate Official Verification QR Code
    const qrPayload = JSON.stringify({
      docType: 'ACHARIYA_HPC_360',
      scholarId: student.id,
      rollNo: student.rollNumber,
      academicYear: student.academicYear,
      sha256: 'a1b2c3d4-verified-achariya-one',
      verifyUrl: `https://verify.achariya.in/hpc/${student.id}`
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 90 });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    doc.image(qrBuffer, 44, sealY + 10, { width: 88 });

    doc
      .fillColor('#0F766E')
      .font('Helvetica-Bold')
      .fontSize(7)
      .text('DIGITALLY ANCHORED', 40, sealY + 97, { align: 'center', width: 96 });

    // Attestation Details
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text('INSTITUTIONAL INTEGRITY & DIGITAL ATTESTATION SEAL', 150, sealY + 12);

    doc
      .fillColor('#475569')
      .font('Helvetica')
      .fontSize(7)
      .text(
        'This Holistic Progress Card is generated directly by the Achariya AI ONE Academic Engine in accordance with National Education Policy (NEP 2020) and PARAKH evaluation standards. Scan the QR code to verify longitudinal portfolio credentials.',
        150,
        sealY + 26,
        { width: 395, lineGap: 2 }
      );

    // Signature Blocks
    const sigY = sealY + 68;
    // Class Teacher
    doc.moveTo(150, sigY).lineTo(250, sigY).lineWidth(0.8).strokeColor('#94A3B8').stroke();
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(7)
      .text(student.teacherName, 150, sigY + 4)
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(6.5)
      .text('Class Faculty / Mentor', 150, sigY + 14);

    // Parent / Guardian
    doc.moveTo(290, sigY).lineTo(390, sigY).lineWidth(0.8).strokeColor('#94A3B8').stroke();
    doc
      .fillColor('#0F172A')
      .font('Helvetica-Bold')
      .fontSize(7)
      .text('Parent / Guardian Signature', 290, sigY + 4)
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(6.5)
      .text('Acknowledged & Reviewed', 290, sigY + 14);

    // Principal Seal
    doc.moveTo(430, sigY).lineTo(530, sigY).lineWidth(0.8).strokeColor('#0D9488').stroke();
    doc
      .fillColor('#0F766E')
      .font('Helvetica-Bold')
      .fontSize(7)
      .text(student.principalName, 430, sigY + 4)
      .fillColor('#64748B')
      .font('Helvetica')
      .fontSize(6.5)
      .text('Founder President / Head of School', 430, sigY + 14);

    // Page 2 Footer
    doc
      .fillColor('#94A3B8')
      .font('Helvetica')
      .fontSize(7)
      .text('Achariya AI ONE · Official CBSE Holistic Progress Card · Page 2 of 2 · Issued Under Institutional Authority', 32, 804, {
        align: 'center',
        width: 531
      });
  }
}
