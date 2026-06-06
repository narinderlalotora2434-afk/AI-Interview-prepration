// FILE: domainConfig.ts | JD-aware ATS scoring system

export type ResumeDomain = 
  | 'software'
  | 'hardware_vlsi'
  | 'embedded'
  | 'mechanical'
  | 'civil'
  | 'data_science'
  | 'product_management'
  | 'healthcare'
  | 'general';

export interface DomainConfig {
  label: string;
  icon: string;
  keyTerms: string[];
  
  // Tiered skills - used for weighted scoring
  tier1Skills: string[];  // Must-have, high ATS weight
  tier2Skills: string[];  // Important, medium weight  
  tier3Skills: string[];  // Nice to have, low weight
  
  irrelevantSkills: string[]; // Never penalize for missing these
  resumeSections: string[];
  
  atsWeights: {
    keywords: number;
    skills: number;
    formatting: number;
    readability: number;
    recruiterImpact: number;
  };
}

export const DOMAIN_CONFIGS: Record<ResumeDomain, DomainConfig> = {

  software: {
    label: "Software Engineering",
    icon: "💻",
    keyTerms: ["software","developer","sde","swe","engineer",
      "frontend","backend","fullstack","web","app","cloud",
      "devops","platform","mobile","ios","android","api"],
    tier1Skills: [
      // Languages
      "JavaScript","TypeScript","Python","Java","C++","Go",
      "Rust","Kotlin","Swift",
      // Frontend
      "React","Next.js","Vue.js","Angular","HTML","CSS",
      "Tailwind","Redux","GraphQL",
      // Backend
      "Node.js","Express","FastAPI","Django","Spring Boot",
      "REST API","Microservices","gRPC",
      // Database
      "SQL","PostgreSQL","MySQL","MongoDB","Redis","Elasticsearch",
      // Cloud & DevOps
      "AWS","GCP","Azure","Docker","Kubernetes","CI/CD",
      "GitHub Actions","Terraform","Linux",
      // Core concepts
      "Data Structures","Algorithms","System Design","OOP",
      "Git","Agile","Code Review"
    ],
    tier2Skills: [
      "WebSockets","OAuth","JWT","Unit Testing","Jest",
      "Cypress","Selenium","Webpack","Vite","Babel",
      "RabbitMQ","Kafka","Apache Spark","Hadoop",
      "Prometheus","Grafana","ELK Stack","Nginx",
      "Load Balancing","Caching","CDN","WebRTC",
      "React Native","Flutter","PWA","WASM",
      "DynamoDB","Cassandra","Neo4j","InfluxDB",
      "Ansible","Helm","ArgoCD","Jenkins"
    ],
    tier3Skills: [
      "Figma","Jira","Confluence","Postman","Swagger",
      "SonarQube","DataDog","New Relic","Splunk",
      "Protocol Buffers","Thrift","OpenAPI","AsyncAPI",
      "Service Mesh","Istio","Envoy","Kong",
      "Blockchain","Solidity","Web3","IPFS"
    ],
    irrelevantSkills: [
      "Verilog","VHDL","Cadence","Synopsys","SPICE",
      "AutoCAD","ANSYS","SolidWorks","CATIA","STAAD Pro",
      "RTOS","Keil","IAR","Bare Metal","JTAG"
    ],
    resumeSections: ["Experience","Projects","Education",
      "Skills","Open Source","Certifications"],
    atsWeights: { keywords:0.35, skills:0.25, 
      formatting:0.15, readability:0.15, recruiterImpact:0.10 }
  },

  hardware_vlsi: {
    label: "Hardware / VLSI",
    icon: "🔧",
    keyTerms: ["vlsi","hardware","chip","semiconductor","rtl",
      "fpga","verilog","vhdl","asic","layout","synthesis",
      "timing","eda","physical design","verification","dft",
      "analog","mixed signal","ic design","tapeout"],
    tier1Skills: [
      // HDL Languages
      "Verilog","SystemVerilog","VHDL","UVM","OVM",
      // Design
      "RTL Design","ASIC Design","FPGA Design",
      "Digital Design","Analog Design","Mixed Signal",
      "Physical Design","Floorplanning","Placement","Routing",
      // EDA Tools
      "Cadence Virtuoso","Synopsys Design Compiler",
      "Cadence Innovus","Synopsys ICC2","Mentor Calibre",
      "Xilinx Vivado","Intel Quartus","ModelSim","VCS",
      // Verification
      "Functional Verification","Formal Verification",
      "Lint","CDC","STA","Timing Closure","DRC","LVS","ERC",
      // Concepts
      "DFT","BIST","Scan Chain","ATPG","Power Analysis",
      "Clock Domain Crossing","Low Power Design","FinFET"
    ],
    tier2Skills: [
      "Tcl Scripting","Python for EDA","Perl",
      "SPICE","HSPICE","Spectre","ADE",
      "Parasitic Extraction","IR Drop","EM Analysis",
      "Signal Integrity","Power Integrity",
      "AMBA","AXI","APB","AHB","PCIe","DDR","USB",
      "Synopsys Primetime","Cadence Tempus",
      "Ansys RedHawk","Ansys PathFinder",
      "Behavioral Modeling","Gate Level Simulation",
      "SERDES","High Speed Interfaces","RF Design",
      "Layout vs Schematic","Design for Manufacturability"
    ],
    tier3Skills: [
      "Machine Learning for EDA","PyTorch","TensorFlow",
      "C++ for Verification","SystemC","TLM",
      "Mentor Questa","Aldec Riviera","Cadence Xcelium",
      "SKILL Language","OpenROAD","Magic","KLayout",
      "GDS","LEF/DEF","Liberty","SPEF","SDC",
      "Chiplet Design","3DIC","HBM","Packaging"
    ],
    irrelevantSkills: [
      "React","Node.js","Docker","Kubernetes","MongoDB",
      "Express","Next.js","Django","Angular","Vue.js",
      "AutoCAD","SolidWorks","ANSYS Mechanical","STAAD Pro"
    ],
    resumeSections: ["Research","Publications","Projects",
      "Education","Skills","Internships","Lab Experience",
      "Tapeouts","Patents"],
    atsWeights: { keywords:0.30, skills:0.30,
      formatting:0.15, readability:0.15, recruiterImpact:0.10 }
  },

  embedded: {
    label: "Embedded Systems",
    icon: "⚙️",
    keyTerms: ["embedded","firmware","microcontroller","rtos",
      "iot","baremetal","peripheral","driver","interrupt","hal",
      "bsp","bootloader","real-time","mcu","mpu","soc"],
    tier1Skills: [
      // Languages
      "C","C++","Assembly","Python","Rust",
      // RTOS
      "FreeRTOS","RTOS","Zephyr","ThreadX","VxWorks",
      "Bare Metal","Real-Time Systems",
      // Platforms
      "ARM Cortex-M","ARM Cortex-A","STM32","ESP32",
      "Arduino","Raspberry Pi","Beaglebone","PIC","AVR",
      "TI MSP430","Nordic nRF","NXP i.MX",
      // Protocols
      "I2C","SPI","UART","CAN","USB","Ethernet",
      "Modbus","RS485","RS232","1-Wire","LIN",
      // Tools
      "Keil MDK","IAR Workbench","STM32CubeIDE",
      "GDB","JTAG","SWD","OpenOCD","Logic Analyzer",
      // Concepts
      "BSP Development","Device Drivers","Bootloader",
      "DMA","ADC","DAC","PWM","Timer","Interrupts",
      "Memory Management","Linker Scripts","CMSIS"
    ],
    tier2Skills: [
      "Bluetooth LE","WiFi","Zigbee","LoRa","MQTT",
      "CoAP","LwM2M","OTA Update","Secure Boot",
      "TrustZone","MPU","MMU","Cache Coherency",
      "Power Management","DVFS","Sleep Modes",
      "AUTOSAR","Misra C","DO-178C","IEC 61508",
      "CAN FD","FlexRay","MOST","Ethernet TSN",
      "Yocto","Buildroot","OpenEmbedded","LTIB",
      "U-Boot","GRUB","Device Tree","DTS",
      "Linux Kernel","Kernel Module","Character Driver",
      "Block Driver","Network Driver","Platform Driver"
    ],
    tier3Skills: [
      "FPGA Prototyping","SystemC","Simulink",
      "MATLAB Embedded Coder","LabVIEW FPGA",
      "AUTOSAR Adaptive","ROS","ROS2",
      "TensorFlow Lite","Edge AI","TinyML",
      "Oscilloscope","Signal Generator","DMM",
      "EMC Testing","CE Marking","FCC Certification",
      "PCB Design","Altium","KiCad","Eagle"
    ],
    irrelevantSkills: [
      "React","MongoDB","Docker","GraphQL","Kubernetes",
      "Node.js","Angular","Vue","Next.js","Django",
      "AutoCAD","SolidWorks","ANSYS","CATIA"
    ],
    resumeSections: ["Projects","Experience","Education",
      "Skills","Firmware","Protocols","Publications"],
    atsWeights: { keywords:0.30, skills:0.30,
      formatting:0.15, readability:0.15, recruiterImpact:0.10 }
  },

  mechanical: {
    label: "Mechanical Engineering",
    icon: "🔩",
    keyTerms: ["mechanical","manufacturing","design","cad","cam",
      "thermal","fluid","structural","fea","cfd","solidworks",
      "product design","tooling","machining","hvac","piping",
      "turbine","automotive","aerospace","robotics"],
    tier1Skills: [
      // CAD/CAM Tools
      "SolidWorks","AutoCAD","CATIA","PTC Creo","Siemens NX",
      "Fusion 360","Inventor","SOLIDWORKS Simulation",
      // Analysis Tools
      "ANSYS Mechanical","ANSYS Fluent","ANSYS CFX",
      "Abaqus","NASTRAN","HyperMesh","OpenFOAM",
      "MATLAB","Simulink",
      // Core Skills
      "FEA","CFD","GD&T","Design for Manufacturing",
      "Technical Drawing","Engineering Drawing",
      "Tolerance Analysis","Stress Analysis",
      "Heat Transfer","Thermodynamics","Fluid Mechanics",
      // Manufacturing
      "CNC Machining","3D Printing","Injection Molding",
      "Sheet Metal","Welding","Casting","Forging",
      "Lean Manufacturing","Six Sigma","Quality Control",
      // Standards
      "ASME Standards","ISO Standards","DIN Standards",
      "ASTM","Material Science","Metallurgy"
    ],
    tier2Skills: [
      "HVAC Design","Piping Design","Pressure Vessel",
      "Fatigue Analysis","Vibration Analysis","Modal Analysis",
      "Topology Optimization","Generative Design",
      "Rapid Prototyping","Reverse Engineering",
      "PLM","PDM","Teamcenter","Windchill","Enovia",
      "FMEA","DFMEA","PFMEA","Control Plan",
      "DOE","Taguchi Method","Response Surface",
      "AutoCAD Plant 3D","Caesar II","PV Elite",
      "Robot Simulation","Adams","MATLAB Robotics",
      "LabVIEW","Data Acquisition","Sensors & Actuators",
      "Hydraulics","Pneumatics","Power Transmission"
    ],
    tier3Skills: [
      "Python for Engineering","MATLAB Scripting",
      "Project Management","MS Project","Primavera",
      "Cost Estimation","BOM Management","ECO Process",
      "Supply Chain","Procurement","Vendor Management",
      "Composite Materials","Polymer Science",
      "Tribology","Acoustics","NVH Analysis",
      "Automotive APQP","PPAP","MSA","SPC",
      "Aerospace AS9100","Medical Device ISO 13485"
    ],
    irrelevantSkills: [
      "React","Python Web","JavaScript","Docker",
      "Node.js","SQL Databases","MongoDB","AWS",
      "Verilog","VHDL","RTOS","Kubernetes"
    ],
    resumeSections: ["Experience","Design Projects","Education",
      "Skills","Internships","Certifications","Publications"],
    atsWeights: { keywords:0.30, skills:0.25,
      formatting:0.20, readability:0.15, recruiterImpact:0.10 }
  },

  civil: {
    label: "Civil Engineering",
    icon: "🏗️",
    keyTerms: ["civil","structural","construction","geotechnical",
      "transportation","water resources","surveying","revit",
      "staad","infrastructure","highway","bridge","foundation",
      "environmental","urban planning","quantity surveying"],
    tier1Skills: [
      // Design & Analysis Software
      "AutoCAD","Revit","STAAD Pro","SAP2000","ETABS",
      "SAFE","RISA","Civil 3D","AutoCAD Civil 3D",
      "MicroStation","OpenRoads","InRoads",
      // Analysis
      "Structural Analysis","Structural Design",
      "Geotechnical Analysis","Foundation Design",
      "Load Analysis","Seismic Analysis","Wind Load",
      "Concrete Design","Steel Design","Timber Design",
      // Standards
      "ACI 318","AISC","IS Codes","Eurocode","AASHTO",
      "IBC","UBC","LRFD","ASD",
      // Software
      "MATLAB","Excel VBA","AutoCAD MEP",
      "Primavera P6","MS Project",
      // Core
      "RCC Design","Pre-stressed Concrete",
      "Soil Mechanics","Hydrology","Hydraulics",
      "Traffic Engineering","Highway Design",
      "Water Supply","Sanitation","Drainage Design",
      "Quantity Estimation","BOQ","Rate Analysis"
    ],
    tier2Skills: [
      "ArcGIS","QGIS","GIS Mapping","Remote Sensing",
      "Total Station","GPS Surveying","Drone Survey",
      "BIM","Navisworks","Tekla Structures",
      "PLAXIS","GeoStudio","SLOPE/W","SEEP/W",
      "HEC-RAS","HEC-HMS","SWMM","EPANET",
      "Piping Design","Process Piping","CAESAR II",
      "Environmental Impact Assessment",
      "Construction Management","Contract Management",
      "FIDIC Contracts","IS Specifications",
      "Value Engineering","Cost Control","Earned Value"
    ],
    tier3Skills: [
      "Python for Civil","MATLAB Civil Applications",
      "LiDAR","Photogrammetry","Point Cloud",
      "Smart Cities","IoT Sensors","SHM",
      "Green Building","LEED","GRIHA","IGBC",
      "Pavement Design","IITPAVE","WinPAS",
      "Offshore Structures","Marine Engineering",
      "Tunnel Design","Underground Structures",
      "Forensic Engineering","Failure Analysis"
    ],
    irrelevantSkills: [
      "React","Python Web","JavaScript","Docker",
      "Node.js","MongoDB","AWS","Kubernetes",
      "Verilog","RTOS","VLSI","Machine Learning"
    ],
    resumeSections: ["Experience","Site Projects","Education",
      "Skills","Certifications","Internships",
      "Research","Publications"],
    atsWeights: { keywords:0.30, skills:0.25,
      formatting:0.20, readability:0.15, recruiterImpact:0.10 }
  },

  data_science: {
    label: "Data Science / ML / AI",
    icon: "📊",
    keyTerms: ["data","machine learning","ml","ai","analytics",
      "statistics","model","nlp","computer vision","kaggle",
      "research","deep learning","data engineer","bi","analyst",
      "scientist","llm","generative ai","mlops"],
    tier1Skills: [
      // Languages
      "Python","R","SQL","Scala","Julia",
      // ML Frameworks
      "TensorFlow","PyTorch","Keras","JAX","Hugging Face",
      "Scikit-learn","XGBoost","LightGBM","CatBoost",
      // Data Processing
      "Pandas","NumPy","Polars","Dask","Spark","PySpark",
      // Statistics & Math
      "Statistics","Probability","Linear Algebra",
      "Calculus","Bayesian Statistics","A/B Testing",
      "Hypothesis Testing","Regression","Classification",
      // ML Concepts
      "Machine Learning","Deep Learning","NLP","CV",
      "Reinforcement Learning","Transfer Learning",
      "Feature Engineering","Model Evaluation","MLOps",
      // Visualization
      "Matplotlib","Seaborn","Plotly","Tableau","Power BI",
      // Cloud ML
      "AWS SageMaker","GCP Vertex AI","Azure ML",
      "MLflow","Weights & Biases","DVC"
    ],
    tier2Skills: [
      "LLM","GPT","BERT","Transformers","Attention",
      "RAG","Vector Databases","Pinecone","Weaviate",
      "LangChain","LlamaIndex","Prompt Engineering",
      "Computer Vision","OpenCV","YOLO","ResNet",
      "Object Detection","Image Segmentation","OCR",
      "Time Series","ARIMA","Prophet","LSTM",
      "Recommendation Systems","Collaborative Filtering",
      "Graph Neural Networks","GNN","Knowledge Graph",
      "Apache Kafka","Airflow","Prefect","dbt",
      "Snowflake","BigQuery","Redshift","Databricks",
      "Docker","Kubernetes","FastAPI","Flask for ML",
      "Explainability","SHAP","LIME","Fairness"
    ],
    tier3Skills: [
      "Rust for ML","C++ for ML","CUDA","GPU Programming",
      "Quantization","Pruning","Knowledge Distillation",
      "Federated Learning","Differential Privacy",
      "Causal Inference","Uplift Modeling",
      "Operations Research","Linear Programming",
      "Simulation","Monte Carlo","Agent Based Modeling",
      "Bioinformatics","Genomics","Proteomics",
      "Financial Modeling","Quant Finance","Risk Models",
      "IoT Analytics","Edge ML","TinyML","ONNX"
    ],
    irrelevantSkills: [
      "Verilog","VHDL","AutoCAD","ANSYS Mechanical",
      "RTOS","Keil","SolidWorks","CATIA","STAAD Pro",
      "Physical Design","RTL","FPGA Design"
    ],
    resumeSections: ["Experience","Research","Projects",
      "Education","Publications","Skills","Kaggle","Patents"],
    atsWeights: { keywords:0.35, skills:0.25,
      formatting:0.15, readability:0.15, recruiterImpact:0.10 }
  },

  product_management: {
    label: "Product Management",
    icon: "📋",
    keyTerms: ["product","manager","roadmap","agile","scrum",
      "stakeholder","launch","strategy","gtm","metrics","kpi",
      "product owner","ux","growth","monetization","b2b","b2c",
      "saas","platform","mobile product"],
    tier1Skills: [
      // Core PM Skills
      "Product Roadmap","Product Strategy","Product Vision",
      "Go-To-Market","GTM Strategy","Competitive Analysis",
      "Market Research","User Research","Customer Discovery",
      "A/B Testing","Experimentation","Data-Driven",
      "PRD","Product Requirements","User Stories",
      "Acceptance Criteria","Epics","Sprint Planning",
      // Frameworks
      "Agile","Scrum","Kanban","SAFe","OKRs","KPIs",
      "Jobs To Be Done","Design Thinking","Lean Startup",
      "North Star Metric","RICE","MoSCoW","Kano Model",
      // Tools
      "JIRA","Confluence","Asana","Linear","Notion",
      "Figma","Miro","Amplitude","Mixpanel","Heap",
      "SQL","Tableau","Looker","Google Analytics",
      // Soft Skills
      "Stakeholder Management","Cross-functional",
      "Executive Communication","Prioritization"
    ],
    tier2Skills: [
      "Technical Product Management","API Products",
      "Platform Strategy","Developer Experience",
      "Pricing Strategy","Monetization","Revenue Growth",
      "Retention","Churn","LTV","CAC","DAU","MAU",
      "Feature Flagging","LaunchDarkly","Split.io",
      "Usertesting.com","Hotjar","FullStory","Intercom",
      "Customer Journey Mapping","Service Blueprint",
      "Accessibility","WCAG","Internationalization",
      "App Store Optimization","Mobile Growth",
      "Partnership Management","API Strategy",
      "Product Analytics","Cohort Analysis",
      "Funnel Optimization","Conversion Rate",
      "NPS","CSAT","CES","Voice of Customer"
    ],
    tier3Skills: [
      "Python for Product","SQL Advanced","R",
      "Machine Learning Basics","AI Product Strategy",
      "Blockchain Products","Web3 Products",
      "Hardware Product Management","IoT Products",
      "Healthcare Products","Fintech Products",
      "EdTech Products","B2B SaaS Metrics",
      "Enterprise Sales","PLG","Sales-Led Growth",
      "Community Building","Developer Relations",
      "Open Source Strategy","Platform Ecosystems"
    ],
    irrelevantSkills: [
      "Verilog","RTOS","AutoCAD","ANSYS","SolidWorks",
      "VHDL","Cadence","Synopsys","Physical Design",
      "STAAD Pro","ETABS","CATIA"
    ],
    resumeSections: ["Experience","Education","Skills",
      "Products Launched","Leadership","Certifications",
      "Impact Metrics"],
    atsWeights: { keywords:0.30, skills:0.20,
      formatting:0.20, readability:0.20, recruiterImpact:0.10 }
  },

  healthcare: {
    label: "Healthcare / Biomedical",
    icon: "🏥",
    keyTerms: ["healthcare","medical","clinical","biomedical",
      "research","patient","hospital","pharmaceutical","lab",
      "biology","fda","hl7","ehr","emr","nursing","doctor",
      "physician","pharmacist","biotech","genomics","clinical trial"],
    tier1Skills: [
      // Clinical & Research
      "Clinical Research","Clinical Trials","GCP","GLP","GMP",
      "IRB","Protocol Development","CRF Design",
      "Informed Consent","Patient Recruitment",
      "FDA Regulations","ICH Guidelines","21 CFR Part 11",
      "Medical Writing","Regulatory Affairs",
      "Pharmacovigilance","Drug Safety","Adverse Events",
      // Health IT
      "HL7","FHIR","EMR","EHR","Epic","Cerner",
      "DICOM","ICD-10","CPT Codes","SNOMED CT","LOINC",
      // Lab Skills
      "PCR","ELISA","Western Blot","Flow Cytometry",
      "Cell Culture","Microscopy","Spectroscopy",
      "HPLC","Mass Spectrometry","Gel Electrophoresis",
      // Analysis
      "SPSS","SAS","R","Stata","MATLAB","Biostatistics",
      "Clinical Data Management","EDC Systems","Medidata Rave"
    ],
    tier2Skills: [
      "Python for Bioinformatics","Biopython","BioConductor",
      "NGS Analysis","RNA-Seq","Genomics","Proteomics",
      "Metabolomics","Bioinformatics","BLAST","NCBI",
      "Machine Learning in Healthcare","Medical Imaging AI",
      "Computer-Aided Diagnosis","Digital Pathology",
      "Wearables","Remote Patient Monitoring","mHealth",
      "Telemedicine","Health Informatics","Population Health",
      "Quality Improvement","PDCA","Lean Healthcare",
      "Joint Commission","CMS Regulations","HIPAA",
      "Medical Device Design","ISO 13485","IEC 60601",
      "Usability Engineering","Human Factors",
      "Tissue Engineering","Biomaterials","Drug Delivery"
    ],
    tier3Skills: [
      "NLP for Clinical Text","BERT for Healthcare",
      "De-identification","PHI","Real World Evidence",
      "Epidemiology","Biostatistics Advanced",
      "Survival Analysis","Causal Inference Clinical",
      "Health Economics","HEOR","Cost Effectiveness",
      "Grant Writing","NIH Applications","Publication",
      "Pathology","Radiology AI","Cardiology Tech",
      "Surgical Robotics","Prosthetics","Orthotics",
      "Point of Care Testing","IVD","Companion Diagnostics"
    ],
    irrelevantSkills: [
      "React","Docker","Node.js","Kubernetes",
      "MongoDB","AWS Infrastructure","Verilog",
      "AutoCAD","SolidWorks","ANSYS","RTOS","VHDL"
    ],
    resumeSections: ["Research","Publications",
      "Clinical Experience","Education","Certifications",
      "Skills","IRB Approvals","Grants","Patents"],
    atsWeights: { keywords:0.25, skills:0.25,
      formatting:0.20, readability:0.20, recruiterImpact:0.10 }
  },

  general: {
    label: "General",
    icon: "📄",
    keyTerms: [],
    tier1Skills: [],
    tier2Skills: [],
    tier3Skills: [],
    irrelevantSkills: [],
    resumeSections: ["Experience","Education","Skills"],
    atsWeights: { keywords:0.30, skills:0.25,
      formatting:0.20, readability:0.15, recruiterImpact:0.10 }
  }
};

export const detectDomain = (title: string, skills: string[], text: string = ''): ResumeDomain => {
  const content = `${title} ${skills.join(' ')} ${text}`.toLowerCase();
  
  // Bug 2 Fix: Check exclusive markers first
  const EXCLUSIVE_DOMAIN_MARKERS: Partial<Record<ResumeDomain, string[]>> = {
    embedded: ['rtos', 'freertos', 'stm32', 'firmware', 'microcontroller', 
               'bare metal', 'jtag', 'bootloader', 'bsp', 'uart', 'i2c', 'spi'],
    hardware_vlsi: ['verilog', 'vhdl', 'rtl', 'asic', 'fpga', 'vlsi', 
                    'cadence', 'synopsys', 'timing closure', 'physical design'],
    mechanical: ['solidworks', 'catia', 'ansys mechanical', 'fea', 'cfd', 
                 'cad', 'autocad', 'creo'],
  };

  for (const [domain, markers] of Object.entries(EXCLUSIVE_DOMAIN_MARKERS)) {
    const exclusiveMatches = markers.filter(m => content.includes(m)).length;
    if (exclusiveMatches >= 2) return domain as ResumeDomain; // Confident detection
  }

  let bestDomain: ResumeDomain = 'general';
  let maxScore = 0;

  for (const [domain, config] of Object.entries(DOMAIN_CONFIGS)) {
    const d = domain as ResumeDomain;
    if (d === 'general') continue;
    let score = 0;
    
    // count key terms
    config.keyTerms.forEach(term => {
      if (content.includes(term.toLowerCase())) {
        score += 2;
      }
    });

    // count tier1 skills
    config.tier1Skills.forEach(skill => {
      if (content.includes(skill.toLowerCase())) {
        score += 3;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestDomain = d;
    }
  }

  return maxScore > 0 ? bestDomain : 'general';
};

export const calculateSkillScore = (
  foundSkills: string[],
  domain: ResumeDomain
): number => {
  const config = DOMAIN_CONFIGS[domain];
  const found = foundSkills.map(s => s.toLowerCase());
  
  // Tier 1: 3 points each (must-have)
  const tier1Hits = config.tier1Skills.filter(s =>
    found.some(f => f.includes(s.toLowerCase()))
  ).length;
  
  // Tier 2: 2 points each (important)  
  const tier2Hits = config.tier2Skills.filter(s =>
    found.some(f => f.includes(s.toLowerCase()))
  ).length;
  
  // Tier 3: 1 point each (nice to have)
  const tier3Hits = config.tier3Skills.filter(s =>
    found.some(f => f.includes(s.toLowerCase()))
  ).length;

  const maxScore = 
    (config.tier1Skills.length * 3) +
    (config.tier2Skills.length * 2) +
    (config.tier3Skills.length * 1);
    
  const actualScore = 
    (tier1Hits * 3) + 
    (tier2Hits * 2) + 
    (tier3Hits * 1);
  
  // Bug 1 Fix: Add career-stage normalization to cap max points
  const careerStageMultiplier = foundSkills.length <= 8 ? 0.3 : 
                                 foundSkills.length <= 15 ? 0.5 : 1.0;
  const cappedMax = Math.round(maxScore * careerStageMultiplier) || 1;
  
  return maxScore > 0 
    ? Math.min(Math.round((actualScore / cappedMax) * 100), 100) 
    : 0;
};

export const getMissingTier1Skills = (
  foundSkills: string[],
  domain: ResumeDomain
): string[] => {
  const config = DOMAIN_CONFIGS[domain];
  const found = foundSkills.map(s => s.toLowerCase());
  return config.tier1Skills
    .filter(s => !found.some(f => f.includes(s.toLowerCase())))
    .slice(0, 8); // top 8 missing critical skills
};

export interface JDAnalysis {
  extractedSkills: string[];
  extractedKeywords: string[];
  requiredSkills: string[];    // "required", "must have"
  preferredSkills: string[];  // "preferred", "nice to have"
  detectedDomain: ResumeDomain;
  jobTitle: string;
  experienceRequired: string;
  educationRequired: string;
}

export const parseJobDescription = (jdText: string): JDAnalysis => {
  const text = jdText.toLowerCase();
  const lines = jdText.split('\n');
  
  // Detect domain from JD text
  const detectedDomain = detectDomain('', [], jdText);
  const config = DOMAIN_CONFIGS[detectedDomain];
  
  // Extract all skills mentioned in JD from ALL domains
  const allSkills = Object.values(DOMAIN_CONFIGS).flatMap(c => [
    ...c.tier1Skills, ...c.tier2Skills, ...c.tier3Skills
  ]);
  const uniqueSkills = [...new Set(allSkills)];
  
  const extractedSkills = uniqueSkills.filter(skill =>
    text.includes(skill.toLowerCase())
  );
  
  // Extract required vs preferred
  const requiredSection = lines.filter(l => {
    const lower = l.toLowerCase();
    return lower.includes('required') || 
           lower.includes('must have') ||
           lower.includes('mandatory') ||
           lower.includes('minimum');
  }).join(' ').toLowerCase();
  
  const preferredSection = lines.filter(l => {
    const lower = l.toLowerCase();
    return lower.includes('preferred') || 
           lower.includes('nice to have') ||
           lower.includes('bonus') ||
           lower.includes('plus') ||
           lower.includes('advantage');
  }).join(' ').toLowerCase();
  
  const requiredSkills = extractedSkills.filter(s =>
    requiredSection.includes(s.toLowerCase())
  );
  
  const preferredSkills = extractedSkills.filter(s =>
    preferredSection.includes(s.toLowerCase()) &&
    !requiredSkills.includes(s)
  );
  
  // Extract keywords (important non-skill terms)
  const importantTerms = [
    'agile','scrum','cross-functional','leadership','communication',
    'problem solving','teamwork','ownership','startup','enterprise',
    'remote','hybrid','onsite','full-time','contract',
    ...config.keyTerms
  ];
  
  const extractedKeywords = importantTerms.filter(term =>
    text.includes(term.toLowerCase())
  );
  
  // Extract experience requirement
  const expMatch = jdText.match(
    /(\d+)\+?\s*(?:to\s*\d+)?\s*years?\s*(?:of\s*)?experience/i
  );
  
  // Extract education requirement  
  const eduMatch = jdText.match(
    /(?:bachelor|master|phd|b\.?tech|m\.?tech|b\.?e|m\.?e|mba)/i
  );
  
  return {
    extractedSkills,
    extractedKeywords,
    requiredSkills: requiredSkills.length > 0 
      ? requiredSkills : extractedSkills.slice(0, 10),
    preferredSkills,
    detectedDomain,
    jobTitle: '',
    experienceRequired: expMatch ? expMatch[0] : 'Not specified',
    educationRequired: eduMatch ? eduMatch[0] : 'Not specified'
  };
};

export interface JDScoreResult {
  totalScore: number;
  keywordsMatch: number;
  skillsCoverage: number;
  compatibility: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  matchPercentage: number;
  recommendation: string;
}

export const calculateJDScore = (
  foundSkills: string[],
  jdAnalysis: JDAnalysis,
  domain: ResumeDomain
): JDScoreResult => {
  const found = foundSkills.map(s => s.toLowerCase());
  const weights = DOMAIN_CONFIGS[domain].atsWeights;
  
  // Match against JD required skills (high weight: 3x)
  const matchedRequired = jdAnalysis.requiredSkills.filter(s =>
    found.some(f => f.includes(s.toLowerCase()))
  );
  const missingRequired = jdAnalysis.requiredSkills.filter(s =>
    !found.some(f => f.includes(s.toLowerCase()))
  );
  
  // Match against JD preferred skills (lower weight: 1x)
  const matchedPreferred = jdAnalysis.preferredSkills.filter(s =>
    found.some(f => f.includes(s.toLowerCase()))
  );
  const missingPreferred = jdAnalysis.preferredSkills.filter(s =>
    !found.some(f => f.includes(s.toLowerCase()))
  );
  
  // Score calculation weighted by required vs preferred
  const requiredScore = jdAnalysis.requiredSkills.length > 0
    ? (matchedRequired.length / jdAnalysis.requiredSkills.length) * 100
    : 100;
    
  const preferredScore = jdAnalysis.preferredSkills.length > 0
    ? (matchedPreferred.length / jdAnalysis.preferredSkills.length) * 100
    : 100;
  
  // Required skills weighted 70%, preferred 30%
  const skillsCoverage = Math.round(
    (requiredScore * 0.7) + (preferredScore * 0.3)
  );
  
  // Keywords match from JD extracted keywords
  const matchedKeywords = jdAnalysis.extractedKeywords.filter(kw =>
    found.some(f => f.includes(kw.toLowerCase()))
  );
  const keywordsMatch = jdAnalysis.extractedKeywords.length > 0
    ? Math.round(
        (matchedKeywords.length / jdAnalysis.extractedKeywords.length) 
        * 100
      )
    : skillsCoverage;
  
  const compatibility = Math.round(
    (skillsCoverage * 0.6) + (keywordsMatch * 0.4)
  );
  
  const totalScore = Math.min(Math.round(
    (keywordsMatch * weights.keywords) +
    (skillsCoverage * weights.skills) +
    (70 * weights.formatting) +  // formatting kept from AI
    (70 * weights.readability) +
    (70 * weights.recruiterImpact)
  ), 100);
  
  const matchPercentage = Math.round(
    (matchedRequired.length + matchedPreferred.length) /
    Math.max(
      jdAnalysis.requiredSkills.length + 
      jdAnalysis.preferredSkills.length, 1
    ) * 100
  );
  
  const recommendation = 
    totalScore >= 80 ? 'Strong match — apply with confidence' :
    totalScore >= 65 ? 'Good match — address skill gaps before applying' :
    totalScore >= 50 ? 'Moderate match — significant gaps to fill' :
    'Low match — considerable upskilling needed';
  
  return {
    totalScore,
    keywordsMatch,
    skillsCoverage,
    compatibility,
    matchedRequiredSkills: matchedRequired,
    missingRequiredSkills: missingRequired,
    matchedPreferredSkills: matchedPreferred,
    missingPreferredSkills: missingPreferred,
    matchPercentage,
    recommendation
  };
};

export const recalculateWithDomain = (analysis: any, domain: ResumeDomain): any => {
  const matched = analysis.keywords?.matched?.length || 0;
  const missing = analysis.keywords?.missing?.length || 0;
  const total = matched + missing;
  
  const keywordRatio = total > 0 ? matched / total : 0;
  const keywordsMatch = Math.round(keywordRatio * 100);
  
  const foundSkills = analysis.skillsGap?.found || [];
  const skillsCoverage = calculateSkillScore(foundSkills, domain);
  
  const compatibility = Math.round((keywordsMatch * 0.5) + (skillsCoverage * 0.5));
  
  const formatting = analysis.atsBreakdown?.formatting || 0;
  const readability = analysis.atsBreakdown?.readability || 0;
  const recruiterImpact = analysis.atsBreakdown?.recruiterImpact || 0;
  
  const weights = DOMAIN_CONFIGS[domain].atsWeights;
  const totalScore = Math.round(
    (keywordsMatch * weights.keywords) +
    (skillsCoverage * weights.skills) +
    (formatting * weights.formatting) +
    (readability * weights.readability) +
    (recruiterImpact * weights.recruiterImpact)
  );
  
  return {
    ...analysis,
    totalScore: Math.min(totalScore, 100),
    atsBreakdown: {
      ...analysis.atsBreakdown,
      compatibility,
      keywordsMatch,
      skillsCoverage,
    }
  };
};
