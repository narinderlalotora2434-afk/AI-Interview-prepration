import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding Branches and Roadmaps...");

  // 1. CSE Branch
  const cse = await prisma.branch.upsert({
    where: { slug: 'cse' },
    update: {},
    create: {
      name: "Computer Science Engineering",
      slug: "cse",
      description: "Focuses on software development, algorithms, system design, and AI/ML.",
      iconName: "Code",
      topRecruiters: JSON.stringify(["Google", "Microsoft", "Amazon", "Atlassian", "Adobe"]),
      salaryRange: "₹8L - ₹45L+",
      difficulty: "Hard"
    }
  });

  // CSE Roadmap
  const cseRoadmap = await prisma.roadmap.create({
    data: {
      branchId: cse.id,
      title: "Software Engineering & Full Stack",
      description: "The complete path to crack top software product companies.",
      modules: {
        create: [
          {
            title: "Foundation & Programming",
            orderIndex: 1,
            topics: {
              create: [
                { title: "C++ or Java Fundamentals", description: "Master one OOP language deeply.", orderIndex: 1 },
                { title: "Data Structures & Algorithms Basics", description: "Arrays, Strings, Linked Lists, Stacks, Queues.", orderIndex: 2 }
              ]
            }
          },
          {
            title: "Advanced DSA",
            orderIndex: 2,
            topics: {
              create: [
                { title: "Trees & Graphs", description: "BST, Graph Traversals, Shortest Paths.", orderIndex: 1 },
                { title: "Dynamic Programming", description: "Memoization, Tabulation, Knapsack, LCS.", orderIndex: 2 }
              ]
            }
          },
          {
            title: "Core CS Subjects",
            orderIndex: 3,
            topics: {
              create: [
                { title: "Object Oriented Programming (OOP)", description: "Inheritance, Polymorphism, Abstraction, Encapsulation.", orderIndex: 1 },
                { title: "Database Management Systems (DBMS)", description: "SQL, Normalization, ACID properties, Indexing.", orderIndex: 2 },
                { title: "Operating Systems", description: "Processes, Threads, Concurrency, Deadlocks, Memory Management.", orderIndex: 3 },
                { title: "Computer Networks", description: "OSI Model, TCP/IP, HTTP/S, Routing.", orderIndex: 4 }
              ]
            }
          },
          {
            title: "System Design",
            orderIndex: 4,
            topics: {
              create: [
                { title: "Low Level Design (LLD)", description: "Design Patterns, SOLID principles, UML.", orderIndex: 1 },
                { title: "High Level Design (HLD)", description: "Scalability, Microservices, Caching, Load Balancing.", orderIndex: 2 }
              ]
            }
          }
        ]
      },
      companyTracks: {
        create: [
          {
            companyName: "Google",
            topics: JSON.stringify(["Hard DP", "Graphs", "System Design"]),
            interviewRounds: JSON.stringify(["Online Assessment", "Technical 1 (DSA)", "Technical 2 (DSA)", "Technical 3 (System Design)", "Googlyness (HR)"])
          },
          {
            companyName: "Amazon",
            topics: JSON.stringify(["Leadership Principles", "Trees", "Arrays", "OOD"]),
            interviewRounds: JSON.stringify(["Online Assessment", "Technical 1 (DSA)", "Technical 2 (DSA + LP)", "Bar Raiser (System Design + LP)"])
          }
        ]
      }
    }
  });


  // 2. ECE Branch
  const ece = await prisma.branch.upsert({
    where: { slug: 'ece' },
    update: {},
    create: {
      name: "Electronics & Communication Engineering",
      slug: "ece",
      description: "Core electronics, VLSI design, embedded systems, and communications.",
      iconName: "Cpu",
      topRecruiters: JSON.stringify(["Qualcomm", "Intel", "Texas Instruments", "NVIDIA", "AMD"]),
      salaryRange: "₹6L - ₹35L+",
      difficulty: "Very Hard"
    }
  });

  // ECE - Core Track
  await prisma.roadmap.create({
    data: {
      branchId: ece.id,
      title: "Core Electronics Track",
      description: "For hardware engineering and core electronics roles.",
      modules: {
        create: [
          {
            title: "Core Fundamentals",
            orderIndex: 1,
            topics: {
              create: [
                { title: "Digital Electronics", description: "Logic gates, Combinational & Sequential Circuits, K-Maps.", orderIndex: 1 },
                { title: "Analog Electronics", description: "Diodes, BJTs, Op-Amps, Oscillators.", orderIndex: 2 },
                { title: "Network Theory", description: "Kirchhoff's Laws, Thevenin/Norton Theorems.", orderIndex: 3 }
              ]
            }
          },
          {
            title: "Advanced Electronics",
            orderIndex: 2,
            topics: {
              create: [
                { title: "Communication Systems", description: "AM, FM, Digital Modulation (ASK, FSK, PSK).", orderIndex: 1 },
                { title: "Signals & Systems", description: "Fourier Transform, Z-Transform, LTI Systems.", orderIndex: 2 },
                { title: "Control Systems", description: "Root Locus, Bode Plots, State Space.", orderIndex: 3 }
              ]
            }
          }
        ]
      }
    }
  });

  // ECE - VLSI Track
  await prisma.roadmap.create({
    data: {
      branchId: ece.id,
      title: "VLSI Design Track",
      description: "Frontend and Backend VLSI design methodologies.",
      modules: {
        create: [
          {
            title: "Frontend Design (RTL)",
            orderIndex: 1,
            topics: {
              create: [
                { title: "CMOS Fundamentals", description: "MOSFETs, Fabrication, Delays.", orderIndex: 1 },
                { title: "Verilog / SystemVerilog", description: "HDLs, Data types, Always blocks, FSMs.", orderIndex: 2 },
                { title: "UVM Basics", description: "Verification methodologies, Testbenches.", orderIndex: 3 }
              ]
            }
          },
          {
            title: "Backend Design (Physical)",
            orderIndex: 2,
            topics: {
              create: [
                { title: "Static Timing Analysis (STA)", description: "Setup/Hold time, Clock Skew, Critical paths.", orderIndex: 1 },
                { title: "Synthesis", description: "Logic synthesis, constraints.", orderIndex: 2 },
                { title: "Design for Testability (DFT)", description: "Scan chains, ATPG.", orderIndex: 3 }
              ]
            }
          }
        ]
      },
      companyTracks: {
        create: [
          {
            companyName: "Qualcomm",
            topics: JSON.stringify(["Digital Electronics", "STA", "C Programming"]),
            interviewRounds: JSON.stringify(["Written Test (Aptitude + Core)", "Technical 1 (Digital & STA)", "Technical 2 (Verilog)", "HR Round"])
          },
          {
            companyName: "Intel",
            topics: JSON.stringify(["SystemVerilog", "Computer Architecture", "CMOS"]),
            interviewRounds: JSON.stringify(["Online Test", "Technical 1 (Architecture)", "Technical 2 (Verification)", "Managerial Round"])
          }
        ]
      }
    }
  });

  // ECE - Embedded Systems Track
  await prisma.roadmap.create({
    data: {
      branchId: ece.id,
      title: "Embedded Systems Track",
      description: "Firmware, microcontrollers, and IoT development.",
      modules: {
        create: [
          {
            title: "Embedded Software",
            orderIndex: 1,
            topics: {
              create: [
                { title: "Embedded C", description: "Bitwise operations, Pointers, Volatile keyword.", orderIndex: 1 },
                { title: "Microprocessors & Microcontrollers", description: "8085, 8051, ARM Cortex-M.", orderIndex: 2 },
                { title: "RTOS", description: "Task scheduling, Mutexes, Semaphores.", orderIndex: 3 }
              ]
            }
          },
          {
            title: "Protocols & Hardware",
            orderIndex: 2,
            topics: {
              create: [
                { title: "Communication Protocols", description: "UART, SPI, I2C, CAN Bus.", orderIndex: 1 },
                { title: "Device Drivers", description: "Linux device drivers, bare-metal programming.", orderIndex: 2 }
              ]
            }
          }
        ]
      },
      companyTracks: {
        create: [
          {
            companyName: "Bosch",
            topics: JSON.stringify(["CAN Bus", "Embedded C", "Microcontrollers"]),
            interviewRounds: JSON.stringify(["Aptitude Test", "Technical 1 (C & Bitwise)", "Technical 2 (Protocols)", "HR Round"])
          }
        ]
      }
    }
  });


  // 3. Mechanical Branch
  const mech = await prisma.branch.upsert({
    where: { slug: 'mechanical' },
    update: {},
    create: {
      name: "Mechanical Engineering",
      slug: "mechanical",
      description: "Automobile, thermodynamics, manufacturing, and design.",
      iconName: "Wrench",
      topRecruiters: JSON.stringify(["Tata Motors", "Mahindra", "L&T", "General Electric", "Maruti Suzuki"]),
      salaryRange: "₹4L - ₹15L+",
      difficulty: "Medium"
    }
  });

  await prisma.roadmap.create({
    data: {
      branchId: mech.id,
      title: "Core Mechanical Placement Track",
      description: "Preparation for automobile, manufacturing, and heavy engineering companies.",
      modules: {
        create: [
          {
            title: "Design & Mechanics",
            orderIndex: 1,
            topics: {
              create: [
                { title: "Strength of Materials", description: "Stress, Strain, Bending Moments, Torsion.", orderIndex: 1 },
                { title: "Theory of Machines", description: "Gears, Cams, Flywheels, Vibrations.", orderIndex: 2 },
                { title: "CAD / CAM / CAE", description: "AutoCAD, SolidWorks, ANSYS basics.", orderIndex: 3 }
              ]
            }
          },
          {
            title: "Thermal & Fluids",
            orderIndex: 2,
            topics: {
              create: [
                { title: "Thermodynamics", description: "Laws, Entropy, Cycles (Otto, Diesel, Rankine).", orderIndex: 1 },
                { title: "Fluid Mechanics", description: "Bernoulli's, Fluid Statics, Pumps & Turbines.", orderIndex: 2 },
                { title: "Heat Transfer", description: "Conduction, Convection, Radiation.", orderIndex: 3 }
              ]
            }
          },
          {
            title: "Manufacturing",
            orderIndex: 3,
            topics: {
              create: [
                { title: "Production Engineering", description: "Casting, Welding, Machining.", orderIndex: 1 },
                { title: "Material Science", description: "Iron-Carbon Diagram, Heat Treatment.", orderIndex: 2 }
              ]
            }
          }
        ]
      },
      companyTracks: {
        create: [
          {
            companyName: "Tata Motors",
            topics: JSON.stringify(["Automobile Engineering", "Thermodynamics", "SOM"]),
            interviewRounds: JSON.stringify(["Aptitude Test", "Technical Interview (Core Concepts)", "Managerial Round", "HR Round"])
          }
        ]
      }
    }
  });

  // Universal Prep Module (Common for all branches, normally handled by the App)
  console.log("Seeding complete!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
