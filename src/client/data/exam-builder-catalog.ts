export interface LearningOutcomeItem {
  id: string;
  code: string;
  text: string;
  bankCount: number;
  bloomTaxonomy: 'Knowledge' | 'Comprehension' | 'Application' | 'Analysis' | 'Synthesis' | 'Evaluation';
}

export interface ChapterLessonCurriculum {
  id: string;
  lessonNumber: number;
  lessonKey: string;
  title: string;
  description: string;
  conceptTags: string[];
  outcomes: LearningOutcomeItem[];
}

export interface SubjectCurriculumCatalog {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  grade: string;
  totalOutcomesCount: number;
  lessons: ChapterLessonCurriculum[];
}

export const ACHARIYA_EXAM_CATALOG: Record<string, SubjectCurriculumCatalog> = {
  'g5-math': {
    subjectId: '1595',
    subjectName: 'Mathematics',
    subjectCode: 'MTH-501',
    grade: 'Grade 5',
    totalOutcomesCount: 37,
    lessons: [
      {
        id: 'les-6404',
        lessonNumber: 1,
        lessonKey: 'Lesson 6404',
        title: 'We the Travellers - I',
        description: 'This chapter introduces students to the concept of large numbers, specifically focusing on the ten thousand place value. It uses the context of travel and transportation across Puducherry to teach reading, writing, comparing, and rounding off numbers.',
        conceptTags: [
          'Reading and writing large numbers',
          'Understanding place value up to ten thousands',
          'Comparing numbers',
          'Rounding off numbers to the nearest ten, hundred, and thousand',
          'Rounding numbers',
          'Place value identification',
          'Logical deduction',
          'Arithmetic operations',
          'Data interpretation'
        ],
        outcomes: [
          {
            id: 'oc-35326',
            code: '#35326',
            text: 'Write 5-digit numbers in expanded form and in words using place value up to ten thousands.',
            bankCount: 28,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35327',
            code: '#35327',
            text: 'Round off a given number to the nearest ten, hundred, or thousand.',
            bankCount: 24,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35328',
            code: '#35328',
            text: 'Compare and arrange 5-digit numbers in ascending or descending order.',
            bankCount: 21,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35329',
            code: '#35329',
            text: 'Identify and extend a numeric sequence by continuing a given pattern.',
            bankCount: 24,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35330',
            code: '#35330',
            text: 'Explain how to compare numbers using place value reasoning.',
            bankCount: 24,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35331',
            code: '#35331',
            text: 'Compare the average distance covered per hour by different modes of transport.',
            bankCount: 24,
            bloomTaxonomy: 'Application'
          }
        ]
      },
      {
        id: 'les-6405',
        lessonNumber: 2,
        lessonKey: 'Lesson 6405',
        title: 'Fractions',
        description: 'Explores part-whole relationships, equivalent fractions, proper and improper fractions, and concrete visual models using circular fraction discs and bar diagrams.',
        conceptTags: [
          'Part-whole relationships',
          'Equivalent fractions',
          'Proper and improper fractions',
          'Simplifying fractional values',
          'Fraction addition with like denominators'
        ],
        outcomes: [
          {
            id: 'oc-35340',
            code: '#35340',
            text: 'Represent fractions using shaded geometric figures and number lines.',
            bankCount: 32,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35341',
            code: '#35341',
            text: 'Determine equivalent fractions by multiplying or dividing numerator and denominator.',
            bankCount: 26,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35342',
            code: '#35342',
            text: 'Convert between mixed numbers and improper fractions with concrete representations.',
            bankCount: 20,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35343',
            code: '#35343',
            text: 'Compare unlike fractions using common denominator techniques.',
            bankCount: 19,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35344',
            code: '#35344',
            text: 'Solve word problems involving addition and subtraction of fractions in daily contexts.',
            bankCount: 25,
            bloomTaxonomy: 'Synthesis'
          },
          {
            id: 'oc-35345',
            code: '#35345',
            text: 'Identify unit fractions and explain their relative magnitudes.',
            bankCount: 18,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35346',
            code: '#35346',
            text: 'Calculate fractional portions of physical quantities (e.g., 3/4 of 60 minutes).',
            bankCount: 22,
            bloomTaxonomy: 'Application'
          }
        ]
      },
      {
        id: 'les-6406',
        lessonNumber: 3,
        lessonKey: 'Lesson 6406',
        title: 'Angles as Turns',
        description: 'Investigation into rotational motion, clock turns, compass directions, acute, right, obtuse, straight, and reflex angles using protractors and physical movement.',
        conceptTags: [
          'Rotational turns',
          'Right angles',
          'Acute and obtuse classification',
          'Protractor measurements',
          'Clock hand angular displacement'
        ],
        outcomes: [
          {
            id: 'oc-35350',
            code: '#35350',
            text: 'Classify angles as acute, right, obtuse, straight, or reflex based on degree measure.',
            bankCount: 30,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35351',
            code: '#35351',
            text: 'Measure and construct angles using a physical or digital protractor within 2 degrees.',
            bankCount: 22,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35352',
            code: '#35352',
            text: 'Relate clock hand revolutions to degrees (1/4 turn = 90°, 1/2 turn = 180°).',
            bankCount: 24,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35353',
            code: '#35353',
            text: 'Identify complementary and supplementary angle pairs in architectural structures.',
            bankCount: 18,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35354',
            code: '#35354',
            text: 'Estimate angular sizes in environmental contexts without instruments.',
            bankCount: 15,
            bloomTaxonomy: 'Evaluation'
          },
          {
            id: 'oc-35355',
            code: '#35355',
            text: 'Calculate missing angles on a straight line and around a central vertex point.',
            bankCount: 27,
            bloomTaxonomy: 'Application'
          }
        ]
      },
      {
        id: 'les-6407',
        lessonNumber: 4,
        lessonKey: 'Lesson 6407',
        title: 'We the Travellers - II',
        description: 'Extended problem solving with large numbers: multi-step multiplication, long division, speed-distance-time calculations, and timetable reading.',
        conceptTags: [
          'Multi-step multiplication',
          'Standard long division algorithm',
          'Speed distance and time formulas',
          'Bus and train schedule analysis',
          'Budget calculation for journeys'
        ],
        outcomes: [
          {
            id: 'oc-35360',
            code: '#35360',
            text: 'Multiply 4-digit numbers by 2-digit numbers using the standard lattice and area models.',
            bankCount: 35,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35361',
            code: '#35361',
            text: 'Divide 4-digit numbers by single- and 2-digit divisors with quotients and remainders.',
            bankCount: 28,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35362',
            code: '#35362',
            text: 'Extract departure, arrival, and journey duration data from railway timetables.',
            bankCount: 20,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35363',
            code: '#35363',
            text: 'Compute total ticket and accommodation expenditure for a school field excursion.',
            bankCount: 23,
            bloomTaxonomy: 'Synthesis'
          },
          {
            id: 'oc-35364',
            code: '#35364',
            text: 'Calculate average travelling speed given total distance and transit hours.',
            bankCount: 26,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35365',
            code: '#35365',
            text: 'Justify the choice of the most economical transport option using comparative division.',
            bankCount: 19,
            bloomTaxonomy: 'Evaluation'
          }
        ]
      },
      {
        id: 'les-6408',
        lessonNumber: 5,
        lessonKey: 'Lesson 6408',
        title: 'Far and Near',
        description: 'Spatial sense, scale drawings, map reading, Cartesian grid coordinates, and linear distance estimation across Puducherry regional maps.',
        conceptTags: [
          'Map scale conversions',
          'Cardinal and ordinal directions',
          'Grid reference coordinates',
          'Shortest route optimization',
          'Distance estimation'
        ],
        outcomes: [
          {
            id: 'oc-35370',
            code: '#35370',
            text: 'Interpret map scales (e.g., 1 cm represents 5 km on ground) to determine actual distance.',
            bankCount: 24,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35371',
            code: '#35371',
            text: 'Locate landmarks on a 2D coordinate grid using column letters and row numbers.',
            bankCount: 20,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35372',
            code: '#35372',
            text: 'Describe paths of movement using directional compass turns and step distances.',
            bankCount: 22,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35373',
            code: '#35373',
            text: 'Draw a scaled floor plan of a classroom with proportional furniture dimensions.',
            bankCount: 16,
            bloomTaxonomy: 'Synthesis'
          },
          {
            id: 'oc-35374',
            code: '#35374',
            text: 'Analyze alternative transit paths on a city map to identify the shortest journey.',
            bankCount: 25,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35375',
            code: '#35375',
            text: 'Evaluate navigational accuracy by cross-referencing scale bars and aerial landmarks.',
            bankCount: 14,
            bloomTaxonomy: 'Evaluation'
          }
        ]
      },
      {
        id: 'les-6409',
        lessonNumber: 6,
        lessonKey: 'Lesson 6409',
        title: 'The Dairy Farm',
        description: 'Capacity and volume measurement: litres and millilitres, container calibration, fractional volumes, and word problems centered on agricultural dairy distribution.',
        conceptTags: [
          'Liquid volume units (L and mL)',
          'Measurement conversions (1L = 1000mL)',
          'Calibrated measuring cylinders',
          'Fractional fluid volumes',
          'Rate of milk collection per cow'
        ],
        outcomes: [
          {
            id: 'oc-35380',
            code: '#35380',
            text: 'Convert fluid capacity between litres and millilitres with arithmetic precision.',
            bankCount: 30,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-35381',
            code: '#35381',
            text: 'Read liquid volume levels on standard calibrated laboratory beakers.',
            bankCount: 25,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-35382',
            code: '#35382',
            text: 'Calculate total milk collection across multiple cattle batches in a dairy farm.',
            bankCount: 22,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35383',
            code: '#35383',
            text: 'Determine the number of small bottles (e.g. 250 mL) filled from a 20-litre milk vat.',
            bankCount: 28,
            bloomTaxonomy: 'Application'
          },
          {
            id: 'oc-35384',
            code: '#35384',
            text: 'Construct bar charts representing weekly liquid yield fluctuations.',
            bankCount: 19,
            bloomTaxonomy: 'Synthesis'
          },
          {
            id: 'oc-35385',
            code: '#35385',
            text: 'Compute financial revenue from milk sales with varying pricing per litre.',
            bankCount: 24,
            bloomTaxonomy: 'Analysis'
          },
          {
            id: 'oc-35386',
            code: '#35386',
            text: 'Assess water wastage and recommend conservation strategies for farm cleaning.',
            bankCount: 15,
            bloomTaxonomy: 'Evaluation'
          }
        ]
      }
    ]
  },
  'g5-sci': {
    subjectId: '1596',
    subjectName: 'Experiential Sciences',
    subjectCode: 'SCI-501',
    grade: 'Grade 5',
    totalOutcomesCount: 24,
    lessons: [
      {
        id: 'les-7001',
        lessonNumber: 1,
        lessonKey: 'Lesson 7001',
        title: 'Energy, Solar Radiation & Chlorophyll',
        description: 'Exploration of sunlight absorption, chloroplast organelles, photosynthesis equations, and thermodynamic energy transfer in coastal botanical systems.',
        conceptTags: ['Photosynthesis', 'Solar energy', 'Chlorophyll', 'Photon absorption', 'Glucose synthesis'],
        outcomes: [
          {
            id: 'oc-40101',
            code: '#40101',
            text: 'Describe the role of chlorophyll pigments in capturing solar photon wavelengths.',
            bankCount: 26,
            bloomTaxonomy: 'Knowledge'
          },
          {
            id: 'oc-40102',
            code: '#40102',
            text: 'Write and balance the word and chemical equations for botanical photosynthesis.',
            bankCount: 22,
            bloomTaxonomy: 'Comprehension'
          },
          {
            id: 'oc-40103',
            code: '#40103',
            text: 'Design an inquiry experiment demonstrating oxygen evolution using aquatic hydrilla.',
            bankCount: 18,
            bloomTaxonomy: 'Synthesis'
          },
          {
            id: 'oc-40104',
            code: '#40104',
            text: 'Analyze how light intensity influences the rate of photosynthetic carbohydrate yield.',
            bankCount: 20,
            bloomTaxonomy: 'Analysis'
          }
        ]
      }
    ]
  }
};

