export interface ChapterSeedData {
  lessonNumber: number;
  title: string;
  description: string;
  periodsRequired: number;
  bloomTaxonomy: string;
  learningOutcomes: string[];
}

export interface BookSeedData {
  subjectName: string;
  subjectCode: string;
  title: string;
  edition: string;
  coverImage: string;
  flipbookUrl: string;
  qrCode: string;
  chapters: ChapterSeedData[];
}

export interface GradeCurriculumData {
  gradeNumber: number;
  gradeName: string;
  stage: 'Foundational Stage' | 'Preparatory Stage' | 'Middle Stage' | 'Secondary Stage';
  books: BookSeedData[];
}

export const CURRICULUM_CATALOG: GradeCurriculumData[] = [
  // ===========================================================================
  // GRADE 1 (FOUNDATIONAL STAGE)
  // ===========================================================================
  {
    gradeNumber: 1,
    gradeName: 'Grade 1',
    stage: 'Foundational Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-01',
        title: 'Achariya Early Phonics & Story Explorers 1',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade1/english-phonics-v1.pdf',
        qrCode: 'ACH-BQR-G01-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Joyful Phonics: Letter Sounds & Rhyme Echoes',
            description: 'Phonemic awareness, vowel sounds A-E-I-O-U, and expressive read-aloud rhymes.',
            periodsRequired: 8,
            bloomTaxonomy: 'Remembering & Understanding',
            learningOutcomes: ['Identify short vowel sounds', 'Blend simple consonant-vowel-consonant (CVC) words']
          },
          {
            lessonNumber: 2,
            title: 'The Talking Tree of Achariyapuram',
            description: 'Listening comprehension, sight word recognition, and storytelling with hand gestures.',
            periodsRequired: 10,
            bloomTaxonomy: 'Understanding & Applying',
            learningOutcomes: ['Sequence narrative story events', 'Use 5 new descriptive sight words']
          },
          {
            lessonNumber: 3,
            title: 'My Colorful World: Sensory Adjectives & Family',
            description: 'Expressive vocabulary for colors, family relationships, and courteous greetings.',
            periodsRequired: 8,
            bloomTaxonomy: 'Applying',
            learningOutcomes: ['Express polite daily greetings in speech', 'Describe domestic animals using sensory words']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-01',
        title: 'Achariya Foundations Math: Numbers, Shapes & Counting 1',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade1/math-foundations-v1.pdf',
        qrCode: 'ACH-BQR-G01-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Number Journeys 1 to 20: Concrete Bead Counting',
            description: 'Hands-on counting using manipulative counters, number line jumps, and one-to-one correspondence.',
            periodsRequired: 12,
            bloomTaxonomy: 'Remembering & Applying',
            learningOutcomes: ['Count concrete objects accurately up to 20', 'Compare collections using more and less']
          },
          {
            lessonNumber: 2,
            title: 'Shapes Around Us: Circles, Triangles & Rectangles',
            description: 'Tactile 2D geometry, spatial awareness, and sorting classroom objects by shape.',
            periodsRequired: 8,
            bloomTaxonomy: 'Analyzing',
            learningOutcomes: ['Identify circles, squares, rectangles, and triangles', 'Recognize repeating color/shape patterns']
          }
        ]
      },
      {
        subjectName: 'Environmental Studies',
        subjectCode: 'ACH-EVS-01',
        title: 'Achariya Discoveries: Living Things & My Senses 1',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade1/evs-discoveries-v1.pdf',
        qrCode: 'ACH-BQR-G01-EVS-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'The Five Senses: Experiencing Our Environment',
            description: 'Hands-on discovery of sight, hearing, touch, taste, and smell in nature.',
            periodsRequired: 8,
            bloomTaxonomy: 'Understanding',
            learningOutcomes: ['Connect sensory organs to daily perceptions', 'Practice hygiene and sensory safety']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 2 (FOUNDATIONAL STAGE)
  // ===========================================================================
  {
    gradeNumber: 2,
    gradeName: 'Grade 2',
    stage: 'Foundational Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-02',
        title: 'Achariya Young Orators & Readers 2',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade2/english-orators-v1.pdf',
        qrCode: 'ACH-BQR-G02-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Phonics Blends & Expressive Storytelling',
            description: 'Digraphs (sh, ch, th), sentence construction, and read-aloud dialogues.',
            periodsRequired: 10,
            bloomTaxonomy: 'Applying',
            learningOutcomes: ['Read aloud decodable passages at 60 WCPM', 'Construct complete sentences with capital letters']
          },
          {
            lessonNumber: 2,
            title: 'The Friendly Dolphin of the Coromandel Coast',
            description: 'Marine ecosystems, empathy for animals, and poetic rhyming couplets.',
            periodsRequired: 10,
            bloomTaxonomy: 'Understanding & Evaluating',
            learningOutcomes: ['Identify main idea and supporting details in a story', 'Perform a mini roleplay dialogue']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-02',
        title: 'Achariya CPA Math: Addition, Patterns & Measurement 2',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade2/cpa-math-v1.pdf',
        qrCode: 'ACH-BQR-G02-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: '2-Digit Addition & Place Value Ten-Frames',
            description: 'Tens and ones grouping, mental math strategies, and number bonds up to 100.',
            periodsRequired: 12,
            bloomTaxonomy: 'Applying & Analyzing',
            learningOutcomes: ['Regroup tens and ones with manipulative blocks', 'Solve real-world two-digit word problems']
          },
          {
            lessonNumber: 2,
            title: 'Time & Currency: Telling Hours and Indian Rupees',
            description: 'Clock faces with minute intervals, Indian coin/currency denominations, and practical market math.',
            periodsRequired: 10,
            bloomTaxonomy: 'Applying',
            learningOutcomes: ['Read clock times to the nearest 15 minutes', 'Calculate change using simulated rupee notes']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 3 (PREPARATORY STAGE)
  // ===========================================================================
  {
    gradeNumber: 3,
    gradeName: 'Grade 3',
    stage: 'Preparatory Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-03',
        title: 'Achariya Global Lingua: Junior Reader 3',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade3/junior-reader-v1.pdf',
        qrCode: 'ACH-BQR-G03-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'The Brave Weaver of Kanchipuram',
            description: 'Traditional craftsmanship, character resilience, and compound sentence structures.',
            periodsRequired: 10,
            bloomTaxonomy: 'Understanding & Applying',
            learningOutcomes: ['Identify cause and effect in narrative prose', 'Use conjunctions: and, but, because, so']
          },
          {
            lessonNumber: 2,
            title: 'Poems of Wind, Rain and Monsoons',
            description: 'Metaphorical imagery, onomatopoeia, and expressive recitation with rhythm.',
            periodsRequired: 8,
            bloomTaxonomy: 'Analyzing & Creating',
            learningOutcomes: ['Recite stanzas with dynamic volume and pauses', 'Identify onomatopoeic sounds in poetry']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-03',
        title: 'Achariya Conceptual Mathematics 3: Multiplication & CPA Geometry',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade3/math-multiplication-v1.pdf',
        qrCode: 'ACH-BQR-G03-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Array Multiplication & Repeated Addition',
            description: 'Arrays, skip counting patterns, and multi-digit multiplication models up to 10 × 10.',
            periodsRequired: 14,
            bloomTaxonomy: 'Applying',
            learningOutcomes: ['Model multiplication as rectangular arrays', 'Master multiplication tables 2 through 9']
          },
          {
            lessonNumber: 2,
            title: 'Fractions as Parts of a Whole',
            description: 'Concrete fraction disks, shaded shapes, and understanding numerators and denominators (1/2, 1/3, 1/4).',
            periodsRequired: 10,
            bloomTaxonomy: 'Understanding & Analyzing',
            learningOutcomes: ['Represent fractions with shaded geometric figures', 'Compare unit fractions on a number line']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-03',
        title: 'Achariya Experiential Sciences 3: Living Things & Habitats',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade3/science-habitats-v1.pdf',
        qrCode: 'ACH-BQR-G03-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Parts of a Plant & Seed Germination Lab',
            description: 'Roots, stems, leaves, flowers, and measuring seed growth under sunlight variations.',
            periodsRequired: 10,
            bloomTaxonomy: 'Applying & Analyzing',
            learningOutcomes: ['Dissect a flowering plant and label reproductive parts', 'Record daily seed germination heights in a chart']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 4 (PREPARATORY STAGE)
  // ===========================================================================
  {
    gradeNumber: 4,
    gradeName: 'Grade 4',
    stage: 'Preparatory Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-04',
        title: 'Achariya Global Lingua: Literature & Speech 4',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade4/literature-speech-v1.pdf',
        qrCode: 'ACH-BQR-G04-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'The Starlight Navigator: Ancient Ocean Voyagers',
            description: 'Maritime navigation by constellations, narrative suspense, and complex descriptive adjectives.',
            periodsRequired: 12,
            bloomTaxonomy: 'Understanding & Evaluating',
            learningOutcomes: ['Differentiate between explicit details and inferred meanings', 'Compose a 150-word adventure journal entry']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-04',
        title: 'Achariya Conceptual Mathematics 4: Long Division & Angles',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade4/math-division-v1.pdf',
        qrCode: 'ACH-BQR-G04-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Long Division & Remainders in Daily Life',
            description: 'Division as equal sharing and grouping, step-by-step division algorithm, and interpreting remainders.',
            periodsRequired: 14,
            bloomTaxonomy: 'Applying',
            learningOutcomes: ['Divide 3-digit numbers by 1-digit divisors', 'Verify quotient using Dividend = Divisor × Quotient + Remainder']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-04',
        title: 'Achariya Experiential Sciences 4: Forces, Matter & Ecosystems',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade4/science-forces-v1.pdf',
        qrCode: 'ACH-BQR-G04-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'States of Matter & Molecular Transformations',
            description: 'Solids, liquids, gases, evaporation, condensation, and temperature experiments with ice and water.',
            periodsRequired: 10,
            bloomTaxonomy: 'Analyzing',
            learningOutcomes: ['Draw particle arrangement diagrams for matter states', 'Explain phase transitions using kinetic energy']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 5 (PREPARATORY STAGE - CORE SHOWCASE)
  // ===========================================================================
  {
    gradeNumber: 5,
    gradeName: 'Grade 5',
    stage: 'Preparatory Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-05',
        title: 'Achariya Global Lingua: Grade 5 Integrated English & Oratory Arts',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade5/english-reader-v1.pdf',
        qrCode: 'ACH-BQR-G05-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'The Great Banyan of Villianur: An Ancient Living Ecosystem',
            description: 'Exploring ecological balance, communal canopy shelter, and sensory poetic resonance.',
            periodsRequired: 12,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['Analyze sensory imagery in ecological prose', 'Deliver a 2-minute persuasive speech on biodiversity conservation']
          },
          {
            lessonNumber: 2,
            title: 'Debating for Tomorrow: Renewable Energy in Our Cities',
            description: 'Structured parliamentary debating, constructing affirmative and negative arguments, and rebuttals.',
            periodsRequired: 14,
            bloomTaxonomy: 'Evaluating & Creating',
            learningOutcomes: ['Formulate structured claims with supporting empirical evidence', 'Deliver respectful oral counter-arguments']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-05',
        title: 'Achariya Conceptual Mathematics 5 (CPA Laboratory)',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade5/math-cpa-v1.pdf',
        qrCode: 'ACH-BQR-G05-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Angle Classification & Dynamic Protractor Measurement',
            description: 'Angles as degrees of rotational turn, acute, right, obtuse, straight, and reflex angles.',
            periodsRequired: 12,
            bloomTaxonomy: 'Analyzing',
            learningOutcomes: ['Measure geometric angles using protractor to ±1° precision', 'Calculate supplementary and complementary angle pairs']
          },
          {
            lessonNumber: 2,
            title: 'Equivalent Fraction Strips, Decimals & Percentages',
            description: 'Connecting fractions to decimal tenths/hundredths and percentage bar representations.',
            periodsRequired: 14,
            bloomTaxonomy: 'Applying & Analyzing',
            learningOutcomes: ['Convert fractions to decimals and percentages', 'Add and subtract unlike fractions using common denominators']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-05',
        title: 'Achariya Experiential Sciences 5: Energy, Ecology & Human Biology',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade5/science-energy-v1.pdf',
        qrCode: 'ACH-BQR-G05-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Chapter 1: The Energy Engine & Thermodynamics',
            description: 'The First Law of Energy Conservation, radiant solar photons, and kinetic-to-potential transformations.',
            periodsRequired: 12,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['State and illustrate the First Law of Energy Conservation', 'Trace energy flow through tropical food webs']
          },
          {
            lessonNumber: 2,
            title: 'Cellular Photosynthesis & Chloroplast Organelles',
            description: 'Chlorophyll pigment photon absorption, carbon dioxide uptake via stomata, and glucose synthesis.',
            periodsRequired: 14,
            bloomTaxonomy: 'Analyzing & Synthesizing',
            learningOutcomes: ['Write the balanced photosynthesis chemical equation', 'Label chloroplast anatomy (thylakoid, stroma, double membrane)']
          }
        ]
      },
      {
        subjectName: 'Artificial Intelligence & Coding',
        subjectCode: 'ACH-AI-05',
        title: 'Achariya Algorithmic Minds 5: Logic, Algorithms & AI Ethics',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade5/ai-coding-v1.pdf',
        qrCode: 'ACH-BQR-G05-AI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Visual Block Algorithms & Conditional Decision Branches',
            description: 'If-else branching, loops, variables, and designing step-by-step maze-solving algorithms.',
            periodsRequired: 10,
            bloomTaxonomy: 'Applying & Creating',
            learningOutcomes: ['Construct visual code scripts with nested conditional branches', 'Debug logical errors in algorithmic sequencing']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 6 (MIDDLE STAGE)
  // ===========================================================================
  {
    gradeNumber: 6,
    gradeName: 'Grade 6',
    stage: 'Middle Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-06',
        title: 'Achariya Rhetoric & Literature 6',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade6/rhetoric-lit-v1.pdf',
        qrCode: 'ACH-BQR-G06-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Classical Indian Fables & Moral Philosophy',
            description: 'Panchatantra narratives, allegorical symbolism, and oratorical debate techniques.',
            periodsRequired: 12,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['Analyze ethical dilemmas in classical prose', 'Write a 250-word analytical character sketch']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-06',
        title: 'Achariya Pure & Applied Mathematics 6: Integers & Pre-Algebra',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade6/math-integers-v1.pdf',
        qrCode: 'ACH-BQR-G06-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Integers on the Number Line: Positive & Negative Reality',
            description: 'Absolute values, integer addition/subtraction rules, and thermal temperature modelling.',
            periodsRequired: 14,
            bloomTaxonomy: 'Applying & Analyzing',
            learningOutcomes: ['Perform arithmetic operations across negative and positive integers', 'Model elevation and financial transactions using integers']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-06',
        title: 'Achariya Integrated Sciences 6: Food, Light & Circuits',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade6/science-circuits-v1.pdf',
        qrCode: 'ACH-BQR-G06-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Electricity, Conductors & Closed Circuit Design',
            description: 'Cells, switches, bulb filaments, schematic circuit diagrams, and conductors vs insulators.',
            periodsRequired: 12,
            bloomTaxonomy: 'Analyzing & Creating',
            learningOutcomes: ['Assemble a functioning multi-switch parallel circuit', 'Differentiate between conductors and dielectric insulators']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 7 (MIDDLE STAGE)
  // ===========================================================================
  {
    gradeNumber: 7,
    gradeName: 'Grade 7',
    stage: 'Middle Stage',
    books: [
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-07',
        title: 'Achariya Advanced Conceptual Mathematics 7: Equations & Data',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade7/math-equations-v1.pdf',
        qrCode: 'ACH-BQR-G07-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Linear Algebraic Equations & Variable Isolation',
            description: 'Balancing equations, inverse operations, word problems, and graphing linear patterns.',
            periodsRequired: 16,
            bloomTaxonomy: 'Applying & Analyzing',
            learningOutcomes: ['Solve single-variable linear equations', 'Translate narrative word problems into algebraic equations']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-07',
        title: 'Achariya Experiential Sciences 7: Chemical Reactions & Heat',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade7/science-chemistry-v1.pdf',
        qrCode: 'ACH-BQR-G07-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Acids, Bases & Universal Indicators Lab',
            description: 'pH scales, litmus, phenolphthalein, neutralization reactions, and antacid titration.',
            periodsRequired: 14,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['Measure pH levels using natural indicator solutions', 'Write word equations for neutralization reactions']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 8 (MIDDLE STAGE)
  // ===========================================================================
  {
    gradeNumber: 8,
    gradeName: 'Grade 8',
    stage: 'Middle Stage',
    books: [
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-08',
        title: 'Achariya Modern Mathematics 8: Algebraic Identities & Geometry',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade8/math-identities-v1.pdf',
        qrCode: 'ACH-BQR-G08-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Algebraic Identities (a+b)², (a-b)², a²-b²',
            description: 'Geometric visual proofs of binomial expansion, factorization, and polynomial division.',
            periodsRequired: 16,
            bloomTaxonomy: 'Analyzing & Creating',
            learningOutcomes: ['Prove standard algebraic identities geometrically', 'Factorize quadratic trinomials using identity models']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-08',
        title: 'Achariya Scientific Inquiry 8: Microorganisms & Cell Biology',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade8/science-microbiology-v1.pdf',
        qrCode: 'ACH-BQR-G08-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Cell Structure: Prokaryotes, Eukaryotes & Organelles',
            description: 'Microscopic examination of onion peel and cheek cells, nucleus, cytoplasm, and cell wall functions.',
            periodsRequired: 14,
            bloomTaxonomy: 'Analyzing',
            learningOutcomes: ['Differentiate between plant and animal cellular structures under microscopy', 'Identify functions of mitochondria and ribosomes']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 9 (SECONDARY STAGE)
  // ===========================================================================
  {
    gradeNumber: 9,
    gradeName: 'Grade 9',
    stage: 'Secondary Stage',
    books: [
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-09',
        title: 'Achariya Higher Mathematics: Geometry & Polynomials 9',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade9/math-polynomials-v1.pdf',
        qrCode: 'ACH-BQR-G09-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Real Numbers & Irrational Number Proofs',
            description: 'Decimal expansions, representing non-terminating recurring numbers, and square root spirals.',
            periodsRequired: 16,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['Prove irrationality of square root numbers', 'Locate surd values on real number lines with geometric precision']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-09',
        title: 'Achariya Advanced Experiential Sciences 9: Physics & Chemistry',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade9/science-physics-v1.pdf',
        qrCode: 'ACH-BQR-G09-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Laws of Motion & Gravitational Dynamics',
            description: "Newton's three laws of motion, inertia, momentum vectors (p=mv), and universal gravitation constant G.",
            periodsRequired: 18,
            bloomTaxonomy: 'Evaluating & Creating',
            learningOutcomes: ['Derive kinematic equations of uniformly accelerated motion', 'Solve numerical momentum conservation problems']
          }
        ]
      }
    ]
  },

  // ===========================================================================
  // GRADE 10 (SECONDARY STAGE - CBSE BOARD MASTER TRACK)
  // ===========================================================================
  {
    gradeNumber: 10,
    gradeName: 'Grade 10',
    stage: 'Secondary Stage',
    books: [
      {
        subjectName: 'English & Oratory Arts',
        subjectCode: 'ACH-ENG-10',
        title: 'Achariya Board Excellence: First Flight & Global Oratory 10',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade10/english-board-v1.pdf',
        qrCode: 'ACH-BQR-G10-ENG-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'A Letter to God & Faith in Human Humanity',
            description: 'Irony in literature, literary deconstruction, and analytical essay responses for CBSE Board.',
            periodsRequired: 12,
            bloomTaxonomy: 'Evaluating & Creating',
            learningOutcomes: ['Analyze situational and dramatic irony in prose', 'Compose high-scoring 120-word CBSE long analytical answers']
          }
        ]
      },
      {
        subjectName: 'Conceptual Mathematics',
        subjectCode: 'ACH-MAT-10',
        title: 'Achariya CBSE Board Master Mathematics 10: Trigonometry & Quadratics',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade10/math-board-v1.pdf',
        qrCode: 'ACH-BQR-G10-MAT-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Trigonometric Ratios & Elevation Angle Applications',
            description: 'Sin, Cos, Tan definitions, standard angle values (30°, 45°, 60°), and heights and distances modeling.',
            periodsRequired: 18,
            bloomTaxonomy: 'Analyzing & Creating',
            learningOutcomes: ['Prove fundamental Pythagorean trigonometric identities', 'Calculate heights and distances using line-of-sight elevation angles']
          },
          {
            lessonNumber: 2,
            title: 'Quadratic Equations & Discriminant Nature of Roots',
            description: 'Completing the square, quadratic formula, discriminant D=b²-4ac, and real-world projectile modeling.',
            periodsRequired: 16,
            bloomTaxonomy: 'Evaluating',
            learningOutcomes: ['Determine nature of roots using discriminant analysis', 'Solve real-world optimization problems with quadratic models']
          }
        ]
      },
      {
        subjectName: 'Experiential Sciences',
        subjectCode: 'ACH-SCI-10',
        title: 'Achariya Board Physics, Chemistry & Biology 10',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade10/science-board-v1.pdf',
        qrCode: 'ACH-BQR-G10-SCI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Chemical Reactions, Stoichiometry & Redox Dynamics',
            description: 'Types of chemical reactions (combination, decomposition, displacement, redox), and balancing chemical equations.',
            periodsRequired: 16,
            bloomTaxonomy: 'Analyzing & Evaluating',
            learningOutcomes: ['Balance complex chemical equations using atom conservation', 'Identify oxidation-reduction couples in electrochemical reactions']
          },
          {
            lessonNumber: 2,
            title: 'Life Processes: Nutrition, Respiration & Double Circulation',
            description: 'Human digestive enzymes, ATP aerobic respiration, nephron filtration, and double circulatory system.',
            periodsRequired: 18,
            bloomTaxonomy: 'Analyzing & Synthesizing',
            learningOutcomes: ['Trace blood flow through four-chambered heart and pulmonary loop', 'Illustrate nephron ultrafiltration mechanism in kidneys']
          }
        ]
      },
      {
        subjectName: 'Artificial Intelligence & Data Science',
        subjectCode: 'ACH-AI-10',
        title: 'Achariya Applied Artificial Intelligence & Neural Systems 10',
        edition: '2026 NEP Edition',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
        flipbookUrl: 'https://assets.achariya.in/curriculum/grade10/ai-neural-v1.pdf',
        qrCode: 'ACH-BQR-G10-AI-001',
        chapters: [
          {
            lessonNumber: 1,
            title: 'Computer Vision & Convolutional Feature Extractors',
            description: 'Pixels, RGB matrices, edge detection kernels, pooling layers, and training object classifiers.',
            periodsRequired: 14,
            bloomTaxonomy: 'Applying & Creating',
            learningOutcomes: ['Explain how kernel convolutions extract spatial image features', 'Train and evaluate a supervised image classification model']
          }
        ]
      }
    ]
  }
];

