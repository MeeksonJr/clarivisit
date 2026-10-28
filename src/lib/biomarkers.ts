import { BiomarkerResult, BiomarkerPanel, BiomarkerStatus } from "@/types/visit";

export interface BiomarkerTemplate {
  name: string;
  panel: BiomarkerPanel;
  unit: string;
  minRange: number;
  maxRange: number;
  defaultStatus?: BiomarkerStatus;
  plainMeaning: string;
  whyItMatters: string;
  lifestyleTips: string;
  doctorDiscussPoint?: string;
  comparatorType?: "range" | "upper_limit" | "lower_limit";
}

export const STANDARD_BIOMARKER_TEMPLATES: Record<string, BiomarkerTemplate> = {
  glucose: {
    name: "Fasting Blood Glucose",
    panel: "Metabolic",
    unit: "mg/dL",
    minRange: 70,
    maxRange: 99,
    plainMeaning: "Measures circulating sugar in your bloodstream after an overnight fast. It is an immediate indicator of insulin sensitivity.",
    whyItMatters: "Keeping fasting glucose between 70-99 mg/dL prevents chronic vascular inflammation and protects your kidneys, eyes, and microvascular capillaries.",
    lifestyleTips: "Prioritize low-glycemic complex carbohydrates (quinoa, lentils, leafy greens) over refined white grains and sugary beverages.",
    doctorDiscussPoint: "Is my fasting glucose stable, or should we monitor alongside post-meal checks?",
    comparatorType: "range",
  },
  a1c: {
    name: "Hemoglobin A1c",
    panel: "Metabolic",
    unit: "%",
    minRange: 4.0,
    maxRange: 5.6,
    plainMeaning: "Measures the percentage of your red blood cell hemoglobin coated with sugar, providing a reliable 90-day glucose average.",
    whyItMatters: "A1c below 5.7% confirms normal glucose metabolism. Pre-diabetes is 5.7%-6.4%, while 6.5%+ indicates diabetes.",
    lifestyleTips: "Consistent aerobic movement (such as your 150 min/week target) increases insulin-independent GLUT4 glucose uptake in skeletal muscles.",
    doctorDiscussPoint: "Does my A1c confirm optimal long-term glycemic control?",
    comparatorType: "upper_limit",
  },
  total_cholesterol: {
    name: "Total Cholesterol",
    panel: "Lipid",
    unit: "mg/dL",
    minRange: 100,
    maxRange: 199,
    plainMeaning: "The cumulative sum of LDL, HDL, and VLDL circulating cholesterol particles synthesized by your liver and ingested from diet.",
    whyItMatters: "Total cholesterol under 200 mg/dL minimizes the likelihood of lipid plaque accumulation in coronary and carotid arterial walls.",
    lifestyleTips: "Increase soluble fiber (oats, chia seeds, Brussels sprouts) which binds bile acids in the digestive tract and excretes excess cholesterol.",
    doctorDiscussPoint: "How is my total cholesterol trending relative to my personal cardiovascular risk score?",
    comparatorType: "upper_limit",
  },
  ldl: {
    name: "LDL Cholesterol (Direct)",
    panel: "Lipid",
    unit: "mg/dL",
    minRange: 50,
    maxRange: 99,
    plainMeaning: "Low-Density Lipoprotein, often termed 'bad' cholesterol, transports lipid molecules from the liver to peripheral tissues.",
    whyItMatters: "Optimal LDL is under 100 mg/dL. Elevated LDL particles can penetrate arterial endothelium and form atherosclerotic plaques.",
    lifestyleTips: "Replace saturated fats (butter, fatty red meats) with polyunsaturated fats (extra virgin olive oil, wild salmon, walnuts, avocados).",
    doctorDiscussPoint: "Should we re-check LDL in 6 months after continuing the dietary swap plan?",
    comparatorType: "upper_limit",
  },
  hdl: {
    name: "HDL Cholesterol",
    panel: "Lipid",
    unit: "mg/dL",
    minRange: 40,
    maxRange: 80,
    plainMeaning: "High-Density Lipoprotein, or 'protective' cholesterol, acts as a vacuum scavenger removing excess lipid particles from blood vessel walls back to the liver.",
    whyItMatters: "Higher is better (>40 mg/dL for men, >50 mg/dL for women). High HDL exerts an anti-inflammatory, atheroprotective effect.",
    lifestyleTips: "Vigorous aerobic exercise, resistance training, and cold-pressed extra virgin olive oil are the most reliable lifestyle boosters for HDL.",
    doctorDiscussPoint: "Is my HDL high enough to provide strong cardiovascular protection?",
    comparatorType: "lower_limit",
  },
  triglycerides: {
    name: "Triglycerides",
    panel: "Lipid",
    unit: "mg/dL",
    minRange: 40,
    maxRange: 149,
    plainMeaning: "The most common type of fat in your body, derived from surplus dietary calories (especially simple sugars, carbohydrates, and alcohol).",
    whyItMatters: "Triglycerides under 150 mg/dL maintain low blood viscosity and support healthy endothelial function.",
    lifestyleTips: "Cutting back on simple carbohydrates (white rice, white pasta, baked goods) and alcohol drastically drops elevated triglycerides.",
    doctorDiscussPoint: "Does my triglyceride reading reflect recent meals or a healthy baseline?",
    comparatorType: "upper_limit",
  },
  cholesterol_ratio: {
    name: "Total / HDL Cholesterol Ratio",
    panel: "Lipid",
    unit: "ratio",
    minRange: 2.0,
    maxRange: 4.4,
    plainMeaning: "A proportional metric comparing total lipid particles against protective scavenger HDL particles. Highly predictive of cardiovascular health.",
    whyItMatters: "A ratio under 3.5 is ideal. Between 3.5 and 4.4 is normal. A high ratio indicates an imbalance of atherogenic versus protective lipoproteins.",
    lifestyleTips: "Both increasing HDL (exercise) and lowering LDL/VLDL (soluble fiber & low sat fat) optimize this ratio simultaneously.",
    doctorDiscussPoint: "Does my cholesterol ratio place me in the lowest cardiovascular risk tier?",
    comparatorType: "upper_limit",
  },
  egfr: {
    name: "eGFR (Estimated Glomerular Filtration Rate)",
    panel: "Renal",
    unit: "mL/min/1.73m²",
    minRange: 90,
    maxRange: 130,
    plainMeaning: "Estimates how many milliliters of blood your kidneys' nephron filters clean every single minute, adjusted for standard body surface area.",
    whyItMatters: "eGFR above 90 confirms optimal kidney performance. Values below 60 indicate reduced renal filtration capacity.",
    lifestyleTips: "Drinking 80+ oz of plain water daily and moderating NSAID pain relievers (like ibuprofen) protects delicate glomerular filtration units.",
    doctorDiscussPoint: "Does my eGFR indicate healthy, robust kidney filtration?",
    comparatorType: "lower_limit",
  },
  creatinine: {
    name: "Serum Creatinine",
    panel: "Renal",
    unit: "mg/dL",
    minRange: 0.60,
    maxRange: 1.20,
    plainMeaning: "A natural metabolic byproduct of normal muscle breakdown that is completely filtered and excreted through your kidneys.",
    whyItMatters: "Normal creatinine (0.60-1.20 mg/dL) proves that renal clearance is functioning properly with no accumulation of metabolic waste.",
    lifestyleTips: "Adequate hydration before blood draws prevents dehydration-induced pseudo-elevations in serum creatinine.",
    doctorDiscussPoint: "Is my creatinine appropriate for my body weight and muscle composition?",
    comparatorType: "range",
  },
  bun: {
    name: "Blood Urea Nitrogen (BUN)",
    panel: "Renal",
    unit: "mg/dL",
    minRange: 7,
    maxRange: 20,
    plainMeaning: "Measures the amount of urea nitrogen in your blood, formed when protein breaks down in the liver and filtered out by kidneys.",
    whyItMatters: "Normal range 7-20 mg/dL. Elevated BUN is most commonly caused by mild dehydration or high protein intake.",
    lifestyleTips: "Drink plentiful water before and after high-protein meals and rigorous physical exertion.",
    doctorDiscussPoint: "Does my BUN confirm good hydration balance?",
    comparatorType: "range",
  },
  alt: {
    name: "ALT (Alanine Aminotransferase)",
    panel: "Hepatic",
    unit: "U/L",
    minRange: 7,
    maxRange: 56,
    plainMeaning: "A crucial enzyme concentrated inside liver cells. Released into the bloodstream if hepatocytes experience cellular strain or inflammation.",
    whyItMatters: "ALT within 7-56 U/L proves liver cells are healthy, intact, and metabolically active with zero hepatic injury.",
    lifestyleTips: "Limiting alcohol, avoiding unnecessary hepatotoxic supplements, and maintaining a healthy body weight shield the liver from fatty infiltration.",
    doctorDiscussPoint: "Does my ALT confirm excellent liver health?",
    comparatorType: "upper_limit",
  },
  ast: {
    name: "AST (Aspartate Aminotransferase)",
    panel: "Hepatic",
    unit: "U/L",
    minRange: 10,
    maxRange: 40,
    plainMeaning: "An enzyme found in the liver, heart, and skeletal muscles. Evaluated alongside ALT to assess organ health.",
    whyItMatters: "Normal range 10-40 U/L confirms absence of acute muscle or liver strain.",
    lifestyleTips: "Avoid strenuous heavy weightlifting in the 24 hours immediately preceding your blood draw, as muscle micro-tears temporarily elevate AST.",
    doctorDiscussPoint: "Is my AST-to-ALT ratio within optimal hepatic parameters?",
    comparatorType: "upper_limit",
  },
  bilirubin: {
    name: "Total Bilirubin",
    panel: "Hepatic",
    unit: "mg/dL",
    minRange: 0.2,
    maxRange: 1.2,
    plainMeaning: "An orange-yellow pigment formed during the normal breakdown of aged red blood cells, processed and excreted by the liver into bile.",
    whyItMatters: "Normal values (0.2-1.2 mg/dL) show clear bile ducts and effective hepatic excretion.",
    lifestyleTips: "A balanced diet with cruciferous vegetables (broccoli, Brussels sprouts) supports phase II liver detoxification pathways.",
    doctorDiscussPoint: "Does my bilirubin level demonstrate normal biliary drainage?",
    comparatorType: "upper_limit",
  },
  sodium: {
    name: "Sodium",
    panel: "Metabolic",
    unit: "mmol/L",
    minRange: 135,
    maxRange: 145,
    plainMeaning: "The primary electrolyte in extracellular fluid, controlling osmotic water balance, nerve transmission, and muscular contraction.",
    whyItMatters: "Standard range 135-145 mmol/L prevents hyponatremia and fluid shifts that cause brain fog or fatigue.",
    lifestyleTips: "Balance natural dietary sodium with potassium-rich whole foods like bananas, avocados, and spinach.",
    doctorDiscussPoint: "Is my electrolyte balance stable?",
    comparatorType: "range",
  },
  potassium: {
    name: "Potassium",
    panel: "Metabolic",
    unit: "mmol/L",
    minRange: 3.5,
    maxRange: 5.0,
    plainMeaning: "The primary intracellular cation essential for cardiac electrical conduction, regular heartbeat, and vascular muscle tone.",
    whyItMatters: "Strictly regulated between 3.5-5.0 mmol/L to safeguard cardiac rhythm against arrhythmias.",
    lifestyleTips: "Enjoy potassium-packed fresh fruits, leafy greens, sweet potatoes, and legumes.",
    doctorDiscussPoint: "Does my potassium confirm healthy cellular and cardiac balance?",
    comparatorType: "range",
  },
  calcium: {
    name: "Calcium (Serum)",
    panel: "Metabolic",
    unit: "mg/dL",
    minRange: 8.5,
    maxRange: 10.2,
    plainMeaning: "Measures circulating ionized and albumin-bound calcium critical for bone mineralization, blood clotting, and neural signaling.",
    whyItMatters: "Normal range 8.5-10.2 mg/dL ensures proper parathyroid function and skeletal density.",
    lifestyleTips: "Combine dietary calcium (yogurt, fortified greens, almonds) with Vitamin D3 for optimal absorption.",
    doctorDiscussPoint: "Is my calcium within the expected physiological range?",
    comparatorType: "range",
  },
  wbc: {
    name: "WBC (White Blood Cell Count)",
    panel: "Hematology",
    unit: "k/uL",
    minRange: 4.5,
    maxRange: 11.0,
    plainMeaning: "The total number of circulating leukocytes (neutrophils, lymphocytes, monocytes, eosinophils) fighting infection in your immune system.",
    whyItMatters: "Standard range 4.5-11.0 k/uL indicates a calm, prepared immune system free of acute viral or bacterial illness.",
    lifestyleTips: "Adequate 7-9 hours of restorative sleep, regular moderate exercise, and vitamin C support baseline leukocyte vitality.",
    doctorDiscussPoint: "Does my WBC confirm healthy baseline immune function?",
    comparatorType: "range",
  },
  hemoglobin: {
    name: "Hemoglobin",
    panel: "Hematology",
    unit: "g/dL",
    minRange: 13.5,
    maxRange: 17.5,
    plainMeaning: "The iron-rich protein in red blood cells that binds oxygen in the lungs and delivers it to every tissue throughout the body.",
    whyItMatters: "Healthy range (13.5-17.5 g/dL in adult males, 12.0-15.5 g/dL in adult females) rules out anemia and ensures high stamina and brain oxygenation.",
    lifestyleTips: "Consume bioavailable dietary iron (lean poultry, dark leafy greens, beans) paired with vitamin C to maximize bioavailability.",
    doctorDiscussPoint: "Does my hemoglobin indicate optimal oxygen delivery and athletic stamina?",
    comparatorType: "range",
  },
  tsh: {
    name: "TSH (Thyroid Stimulating Hormone)",
    panel: "Endocrine",
    unit: "uIU/mL",
    minRange: 0.45,
    maxRange: 4.50,
    plainMeaning: "Produced by your pituitary gland to regulate thyroid gland activity, setting your body's overall metabolic rate and temperature.",
    whyItMatters: "Normal range 0.45-4.50 uIU/mL confirms optimal thyroid signaling without sluggishness (hypothyroidism) or overactivity (hyperthyroidism).",
    lifestyleTips: "Adequate dietary iodine (seafood, iodized salt) and selenium (Brazil nuts, sunflower seeds) support thyroid hormone synthesis.",
    doctorDiscussPoint: "Does my TSH indicate a balanced metabolic baseline?",
    comparatorType: "range",
  },
  vitamin_d: {
    name: "Vitamin D (25-Hydroxy)",
    panel: "General",
    unit: "ng/mL",
    minRange: 30,
    maxRange: 100,
    plainMeaning: "The primary circulating form of Vitamin D, essential for bone density, immune modulation, and mood regulation.",
    whyItMatters: "30-100 ng/mL is optimal. Under 20 ng/mL is deficient, leading to osteopenia and increased susceptibility to infections.",
    lifestyleTips: "15 minutes of midday sun exposure on arms/legs or a daily D3/K2 supplement keeps levels robust year-round.",
    doctorDiscussPoint: "Should I supplement Vitamin D during winter months?",
    comparatorType: "lower_limit",
  },
  rbc: {
    name: "RBC (Red Blood Cell Count)",
    panel: "Hematology",
    unit: "M/uL",
    minRange: 4.35,
    maxRange: 5.65,
    plainMeaning: "The total number of circulating erythrocytes transporting oxygen throughout your circulatory system.",
    whyItMatters: "A healthy count confirms normal bone marrow erythropoiesis and adequate oxygen transport capacity.",
    lifestyleTips: "Staying hydrated and maintaining balanced intake of iron, B12, and folate supports healthy red cell production.",
    doctorDiscussPoint: "Does my red blood cell count confirm optimal oxygenation?",
    comparatorType: "range",
  },
  hematocrit: {
    name: "Hematocrit",
    panel: "Hematology",
    unit: "%",
    minRange: 36.0,
    maxRange: 48.0,
    plainMeaning: "The proportion of total blood volume made up of red blood cells.",
    whyItMatters: "Evaluated alongside hemoglobin to screen for anemia (low) or dehydration/polycythemia (high).",
    lifestyleTips: "Proper daily water hydration maintains healthy blood viscosity and normal hematocrit balance.",
    doctorDiscussPoint: "Is my hematocrit in healthy balance with my plasma volume?",
    comparatorType: "range",
  },
  mcv: {
    name: "MCV (Mean Corpuscular Volume)",
    panel: "Hematology",
    unit: "FL",
    minRange: 78.0,
    maxRange: 100.0,
    plainMeaning: "Measures the physical average size of your individual red blood cells in femtoliters (FL).",
    whyItMatters: "Normal MCV (78-100 FL) proves cells are normocytic. Low MCV suggests iron deficiency or thalassemia trait; high MCV suggests B12/folate deficiency.",
    lifestyleTips: "A balanced diet with lean proteins and leafy greens ensures healthy red cell development.",
    doctorDiscussPoint: "Does my MCV confirm normal red cell size and nutritional status?",
    comparatorType: "range",
  },
  mch: {
    name: "MCH (Mean Corpuscular Hemoglobin)",
    panel: "Hematology",
    unit: "PG",
    minRange: 24.0,
    maxRange: 34.0,
    plainMeaning: "The average weight of hemoglobin inside an average red blood cell.",
    whyItMatters: "Parallels MCV; normal values confirm adequate hemoglobin packaging per cell.",
    lifestyleTips: "Balanced iron and vitamin intake keeps MCH in the optimal bracket.",
    doctorDiscussPoint: "Are my red cell indices stable?",
    comparatorType: "range",
  },
  mchc: {
    name: "MCHC (Mean Corpuscular Hemoglobin Concentration)",
    panel: "Hematology",
    unit: "g/dL",
    minRange: 31.0,
    maxRange: 37.0,
    plainMeaning: "The average concentration or density of hemoglobin in a given volume of red blood cells.",
    whyItMatters: "Normal concentration (31-37 g/dL) confirms healthy color (normochromic) of red cells.",
    lifestyleTips: "Whole food nutrition supports proper red blood cell synthesis.",
    doctorDiscussPoint: "Does my MCHC confirm healthy red cell hemoglobin density?",
    comparatorType: "range",
  },
  rdw: {
    name: "RDW (Red Cell Distribution Width)",
    panel: "Hematology",
    unit: "%",
    minRange: 11.6,
    maxRange: 14.5,
    plainMeaning: "Measures the variation and uniformity in red blood cell sizes.",
    whyItMatters: "Low/normal RDW means your red blood cells are uniform in size, an excellent marker of stable, healthy bone marrow output.",
    lifestyleTips: "Nutrient-dense whole grains and vegetables support consistent red blood cell production.",
    doctorDiscussPoint: "Does my RDW confirm red blood cell uniformity?",
    comparatorType: "upper_limit",
  },
  platelets: {
    name: "Platelets (Thrombocytes)",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 135,
    maxRange: 420,
    plainMeaning: "Cellular fragments essential for normal blood clotting and stopping minor bleeds.",
    whyItMatters: "Normal platelet counts (135-420 K/uL) ensure safe blood clotting without risk of spontaneous bleeding or thrombosis.",
    lifestyleTips: "Moderate physical exercise and limiting heavy alcohol preserve healthy bone marrow platelet production.",
    doctorDiscussPoint: "Does my platelet count show healthy clotting capacity?",
    comparatorType: "range",
  },
  mpv: {
    name: "MPV (Mean Platelet Volume)",
    panel: "Hematology",
    unit: "FL",
    minRange: 9.2,
    maxRange: 11.8,
    plainMeaning: "The average size of circulating platelets. Younger platelets newly released from bone marrow are larger.",
    whyItMatters: "Normal MPV (9.2-11.8 FL) indicates a healthy, steady rate of platelet turnover in bone marrow.",
    lifestyleTips: "General cardiovascular wellness and sleep support normal bone marrow kinetics.",
    doctorDiscussPoint: "Is my platelet volume normal?",
    comparatorType: "range",
  },
  neutrophils_pct: {
    name: "Neutrophils %",
    panel: "Hematology",
    unit: "%",
    minRange: 40.0,
    maxRange: 73.0,
    plainMeaning: "The percentage of your white blood cells that are neutrophils, the primary defenders against bacterial infections.",
    whyItMatters: "A mild variation in percentage (like 38.9%) is common and harmless, especially when the absolute neutrophil count is evaluated alongside it.",
    lifestyleTips: "Adequate rest and stress management support balanced white cell distribution.",
    doctorDiscussPoint: "Is my neutrophil percentage typical for my baseline health?",
    comparatorType: "range",
  },
  neutrophils_abs: {
    name: "Neutrophils Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 1.80,
    maxRange: 8.00,
    plainMeaning: "The actual physical count of circulating neutrophil cells per microliter of blood.",
    whyItMatters: "A mildly low count (e.g. 1.4 K/uL) is frequently benign (constitutional, athletic, or post-viral) when asymptomatic.",
    lifestyleTips: "Support overall immune resilience with balanced zinc, vitamin C, and restorative sleep.",
    doctorDiscussPoint: "In the context of feeling healthy, is my absolute neutrophil count considered a safe constitutional baseline for me?",
    comparatorType: "range",
  },
  lymphocytes_pct: {
    name: "Lymphocytes %",
    panel: "Hematology",
    unit: "%",
    minRange: 21.0,
    maxRange: 52.0,
    plainMeaning: "The percentage of white blood cells consisting of T-cells, B-cells, and natural killer cells fighting viruses.",
    whyItMatters: "Confirms normal viral surveillance and adaptive antibody memory.",
    lifestyleTips: "Regular aerobic exercise mobilizes lymphocytes into circulation for enhanced immune surveillance.",
    doctorDiscussPoint: "Does my lymphocyte distribution confirm healthy viral immunity?",
    comparatorType: "range",
  },
  lymphocytes_abs: {
    name: "Lymphocytes Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.90,
    maxRange: 3.60,
    plainMeaning: "The actual physical number of circulating viral and antibody defense lymphocytes.",
    whyItMatters: "Normal absolute count (0.90-3.60 K/uL) confirms robust adaptive immune reserves.",
    lifestyleTips: "Restful sleep and good nutrition maintain healthy lymphocyte counts.",
    doctorDiscussPoint: "Are my absolute lymphocyte numbers in healthy standing?",
    comparatorType: "range",
  },
  monocytes_pct: {
    name: "Monocytes %",
    panel: "Hematology",
    unit: "%",
    minRange: 3.0,
    maxRange: 10.0,
    plainMeaning: "White blood cells that transform into macrophages to engulf cellular debris and foreign invaders.",
    whyItMatters: "Normal range confirms quiet cellular cleanup without active inflammatory flares.",
    lifestyleTips: "Anti-inflammatory diet (leafy greens, omega-3s) keeps monocyte activation calm.",
    doctorDiscussPoint: "Is my monocyte level normal?",
    comparatorType: "range",
  },
  monocytes_abs: {
    name: "Monocytes Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.05,
    maxRange: 1.20,
    plainMeaning: "The absolute count of circulating monocyte scavenger cells.",
    whyItMatters: "Normal absolute counts reflect quiet, balanced innate immunity.",
    lifestyleTips: "Maintain consistent hydration and physical activity.",
    doctorDiscussPoint: "Are my absolute monocytes normal?",
    comparatorType: "range",
  },
  eosinophils_pct: {
    name: "Eosinophils %",
    panel: "Hematology",
    unit: "%",
    minRange: 0.0,
    maxRange: 5.0,
    plainMeaning: "Specialized white blood cells that respond to allergic reactions and environmental irritants.",
    whyItMatters: "Low/normal values (0-5%) indicate absence of acute allergic flare-ups or asthma exacerbations.",
    lifestyleTips: "Minimize exposure to known allergens and maintain clean indoor air.",
    doctorDiscussPoint: "Does my eosinophil count rule out significant allergic inflammation?",
    comparatorType: "upper_limit",
  },
  eosinophils_abs: {
    name: "Eosinophils Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.00,
    maxRange: 0.40,
    plainMeaning: "The exact number of circulating allergy and parasite defense cells.",
    whyItMatters: "Normal counts confirm absence of eosinophilic inflammatory conditions.",
    lifestyleTips: "A healthy anti-inflammatory lifestyle keeps eosinophils calm.",
    doctorDiscussPoint: "Is my absolute eosinophil count normal?",
    comparatorType: "upper_limit",
  },
  basophils_pct: {
    name: "Basophils %",
    panel: "Hematology",
    unit: "%",
    minRange: 0.0,
    maxRange: 2.0,
    plainMeaning: "Rare white blood cells containing histamine granules involved in early inflammatory responses.",
    whyItMatters: "Normal range (0-2%) confirms baseline calm without systemic histamine release.",
    lifestyleTips: "Balanced nutrition supports normal granulocyte baselines.",
    doctorDiscussPoint: "Are my basophils within normal limits?",
    comparatorType: "upper_limit",
  },
  basophils_abs: {
    name: "Basophils Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.00,
    maxRange: 0.10,
    plainMeaning: "The absolute count of histamine-releasing basophils.",
    whyItMatters: "Normal absolute levels confirm absence of basophilic proliferation.",
    lifestyleTips: "Maintain standard healthy lifestyle habits.",
    doctorDiscussPoint: "Does my basophil count look standard?",
    comparatorType: "upper_limit",
  },
  immature_granulocytes_pct: {
    name: "Immature Granulocytes %",
    panel: "Hematology",
    unit: "%",
    minRange: 0.0,
    maxRange: 0.5,
    plainMeaning: "Early precursor white blood cells (promyelocytes, myelocytes, metamyelocytes) maturing in bone marrow.",
    whyItMatters: "A very slight elevation (such as 0.6% vs 0.5% cutoff) is a minor 0.1% fluctuation that is very common and typically benign after physical exercise or minor stress.",
    lifestyleTips: "Adequate recovery after workouts and proper hydration support steady bone marrow output.",
    doctorDiscussPoint: "Given that my absolute immature granulocytes count is normal, does the slight 0.6% reading have any clinical significance?",
    comparatorType: "upper_limit",
  },
  immature_granulocytes_abs: {
    name: "Immature Granulocytes Absolute",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.00,
    maxRange: 0.04,
    plainMeaning: "The actual count of circulating immature granulocytes.",
    whyItMatters: "A normal absolute count (0.00-0.04 K/uL) confirms that bone marrow release is orderly and controlled.",
    lifestyleTips: "Normal sleep and recovery keep marrow release in physiological balance.",
    doctorDiscussPoint: "Confirms normal absolute count of maturing granulocytes.",
    comparatorType: "upper_limit",
  },
  nrbc: {
    name: "Nucleated RBCs (nRBC)",
    panel: "Hematology",
    unit: "K/uL",
    minRange: 0.00,
    maxRange: 0.01,
    plainMeaning: "Immature red blood cells that still contain a cell nucleus before final maturation into mature erythrocytes.",
    whyItMatters: "Normal value is 0 (or <0.01 K/uL) in adult blood, proving red cells are fully matured before entering circulation.",
    lifestyleTips: "Standard healthy diet supporting marrow maturation.",
    doctorDiscussPoint: "Confirms normal absence of premature red cells in circulation.",
    comparatorType: "upper_limit",
  },
};

/**
 * Computes clinical status based on reference ranges and comparator types
 */
export function computeBiomarkerStatus(
  value: number,
  minRange: number,
  maxRange: number,
  comparatorType: "range" | "upper_limit" | "lower_limit" = "range"
): { status: BiomarkerStatus; flagText: string } {
  if (isNaN(value)) {
    return { status: "normal", flagText: "Normal" };
  }

  if (comparatorType === "upper_limit") {
    if (value <= maxRange * 0.85) {
      return { status: "optimal", flagText: "Optimal" };
    }
    if (value <= maxRange) {
      return { status: "normal", flagText: "Normal" };
    }
    if (value <= maxRange * 1.25) {
      return { status: "elevated", flagText: "Borderline / Watch" };
    }
    if (value <= maxRange * 1.6) {
      return { status: "high", flagText: "High" };
    }
    return { status: "critical", flagText: "Significantly High" };
  }

  if (comparatorType === "lower_limit") {
    if (value >= minRange * 1.25) {
      return { status: "optimal", flagText: "Optimal" };
    }
    if (value >= minRange) {
      return { status: "normal", flagText: "Normal" };
    }
    if (value >= minRange * 0.75) {
      return { status: "low", flagText: "Slightly Low" };
    }
    return { status: "critical", flagText: "Low" };
  }

  // Standard Two-sided Range
  if (value < minRange * 0.75) {
    return { status: "critical", flagText: "Significantly Low" };
  }
  if (value < minRange) {
    return { status: "low", flagText: "Low" };
  }
  if (value > maxRange * 1.4) {
    return { status: "critical", flagText: "Significantly High" };
  }
  if (value > maxRange) {
    return { status: "elevated", flagText: "Elevated" };
  }

  // Value is within minRange and maxRange
  const mid = (minRange + maxRange) / 2;
  const spread = (maxRange - minRange) / 2;
  const distFromMid = Math.abs(value - mid);

  if (distFromMid <= spread * 0.6) {
    return { status: "optimal", flagText: "Optimal" };
  }
  return { status: "normal", flagText: "Normal" };
}

/**
 * 18 realistic sample biomarkers corresponding to the demo visit and 6 doctor orders
 */
export const DEFAULT_SAMPLE_BIOMARKERS: BiomarkerResult[] = [
  {
    id: "bio_glucose",
    name: "Fasting Blood Glucose",
    panel: "Metabolic",
    value: 92,
    unit: "mg/dL",
    minRange: 70,
    maxRange: 99,
    status: "optimal",
    flagText: "Optimal Baseline",
    plainMeaning: "Measures circulating sugar in your bloodstream after an overnight fast. Confirms healthy insulin sensitivity and pancreas function.",
    whyItMatters: "92 mg/dL is firmly inside the optimal healthy bracket (<100 mg/dL). It rules out impaired fasting glucose.",
    lifestyleTips: "Your doctor's advice to swap white pasta/rice with quinoa and eat leafy greens helps maintain stable glucose without insulin spikes.",
    doctorDiscussPoint: "Confirms normal glucose regulation; no further diagnostic glucose testing required.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_a1c",
    name: "Hemoglobin A1c",
    panel: "Metabolic",
    value: 5.4,
    unit: "%",
    minRange: 4.0,
    maxRange: 5.6,
    status: "optimal",
    flagText: "Optimal (< 5.7%)",
    plainMeaning: "The percentage of red blood cell hemoglobin coated with sugar over the past 90 days. The gold standard for diabetes screening.",
    whyItMatters: "5.4% is optimal. Even though 'Pre-diabetes screening' was billed on your summary to order this preventive test, your actual result confirms you do NOT have pre-diabetes (which starts at 5.7%).",
    lifestyleTips: "Continuing your 150 minutes of weekly aerobic exercise helps muscle cells consume circulating glucose naturally.",
    doctorDiscussPoint: "Reassures that the pre-diabetes screening code was strictly preventive and your 3-month average is completely normal.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_ldl",
    name: "LDL-C (Direct)",
    panel: "Lipid",
    value: 108,
    unit: "mg/dL",
    minRange: 50,
    maxRange: 99,
    status: "elevated",
    flagText: "Borderline (Target < 100)",
    plainMeaning: "Low-Density Lipoprotein, which transports cholesterol from the liver into peripheral circulation.",
    whyItMatters: "108 mg/dL is slightly above the desirable target (<100 mg/dL). This is common and highly responsive to diet and exercise.",
    lifestyleTips: "The doctor's prescription to reduce simple carbohydrates, cut saturated fats, and introduce leafy greens directly lowers LDL. Adding 1 tbsp of ground flaxseed or oats accelerates clearance.",
    doctorDiscussPoint: "Ask your provider if a repeat lipid panel in 6 to 12 months is recommended after continuing your dietary swaps.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_total_chol",
    name: "Total Cholesterol",
    panel: "Lipid",
    value: 184,
    unit: "mg/dL",
    minRange: 100,
    maxRange: 199,
    status: "optimal",
    flagText: "Desirable (< 200)",
    plainMeaning: "The cumulative sum of all circulating cholesterol fractions (LDL, HDL, and VLDL).",
    whyItMatters: "184 mg/dL is safely under the 200 mg/dL clinical threshold, keeping overall cardiovascular atherogenic risk low.",
    lifestyleTips: "Maintain plenty of soluble fiber and monounsaturated fats from extra virgin olive oil and avocados.",
    doctorDiscussPoint: "Overall total cholesterol is in a healthy, cardioprotective range.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_hdl",
    name: "HDL Cholesterol",
    panel: "Lipid",
    value: 54,
    unit: "mg/dL",
    minRange: 40,
    maxRange: 80,
    status: "optimal",
    flagText: "Protective (> 40)",
    plainMeaning: "High-Density Lipoprotein ('good' cholesterol) that vacuums excess cholesterol from artery walls and returns it to the liver for excretion.",
    whyItMatters: "54 mg/dL is above the 40 mg/dL minimum, exerting an active protective anti-inflammatory effect on blood vessels.",
    lifestyleTips: "Regular brisk cardio and resistance exercise maintain high HDL levels.",
    doctorDiscussPoint: "Healthy protective HDL levels noted.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_triglycerides",
    name: "Triglycerides",
    panel: "Lipid",
    value: 110,
    unit: "mg/dL",
    minRange: 40,
    maxRange: 149,
    status: "normal",
    flagText: "Normal (< 150)",
    plainMeaning: "Circulating fat particles derived from unused calories, sugars, and simple carbohydrates in the diet.",
    whyItMatters: "110 mg/dL is well below the 150 mg/dL boundary, reflecting healthy carbohydrate clearance.",
    lifestyleTips: "Avoid sweet tea, sugary sodas, and late-night snacking to keep triglycerides low.",
    doctorDiscussPoint: "Normal triglyceride profile.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_chol_ratio",
    name: "Total / HDL Ratio",
    panel: "Lipid",
    value: 3.4,
    unit: "ratio",
    minRange: 2.0,
    maxRange: 4.4,
    status: "optimal",
    flagText: "Optimal (< 3.5)",
    plainMeaning: "The proportion between overall cholesterol particles and protective HDL scavenger molecules.",
    whyItMatters: "A ratio of 3.4 is optimal (<3.5), confirming that despite slight LDL elevation, your cardiovascular risk ratio remains low.",
    lifestyleTips: "Continue the 5x 30-min weekly movement plan to keep this balance ideal.",
    doctorDiscussPoint: "Total/HDL ratio demonstrates low cardiovascular risk.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_egfr",
    name: "eGFR (Kidney Filtration)",
    panel: "Renal",
    value: 108,
    unit: "mL/min/1.73m²",
    minRange: 90,
    maxRange: 130,
    status: "optimal",
    flagText: "Optimal (> 90)",
    plainMeaning: "Estimated Glomerular Filtration Rate: how many milliliters of blood your kidneys clean every minute.",
    whyItMatters: "108 mL/min is outstanding (>90 is normal), indicating prime filtration and robust renal health.",
    lifestyleTips: "Continue drinking 80+ oz of plain water daily to support kidney filtration.",
    doctorDiscussPoint: "Excellent kidney function confirmed.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_creatinine",
    name: "Serum Creatinine",
    panel: "Renal",
    value: 0.88,
    unit: "mg/dL",
    minRange: 0.60,
    maxRange: 1.20,
    status: "optimal",
    flagText: "Normal (0.60 - 1.20)",
    plainMeaning: "A muscle breakdown byproduct filtered completely by healthy kidneys.",
    whyItMatters: "0.88 mg/dL confirms that waste clearance is efficient with zero buildup in the bloodstream.",
    lifestyleTips: "Maintain consistent hydration especially during workouts.",
    doctorDiscussPoint: "Normal creatinine level.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_bun",
    name: "Blood Urea Nitrogen (BUN)",
    panel: "Renal",
    value: 14,
    unit: "mg/dL",
    minRange: 7,
    maxRange: 20,
    status: "normal",
    flagText: "Normal (7 - 20)",
    plainMeaning: "Measures urea nitrogen produced when protein breaks down in the liver.",
    whyItMatters: "14 mg/dL is balanced, proving proper hydration and protein clearance.",
    lifestyleTips: "Drinking water consistently throughout the day prevents dehydration-related BUN spikes.",
    doctorDiscussPoint: "Normal BUN.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_alt",
    name: "ALT (Liver Enzyme)",
    panel: "Hepatic",
    value: 24,
    unit: "U/L",
    minRange: 7,
    maxRange: 56,
    status: "optimal",
    flagText: "Optimal (7 - 56)",
    plainMeaning: "Alanine Aminotransferase: concentrated in liver cells; low levels in blood mean liver cells are healthy and intact.",
    whyItMatters: "24 U/L indicates absence of liver inflammation or fatty liver infiltration.",
    lifestyleTips: "Limiting alcohol and refined fructose keeps liver enzymes low.",
    doctorDiscussPoint: "Healthy liver enzyme profile.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_ast",
    name: "AST (Liver/Muscle Enzyme)",
    panel: "Hepatic",
    value: 22,
    unit: "U/L",
    minRange: 10,
    maxRange: 40,
    status: "optimal",
    flagText: "Optimal (10 - 40)",
    plainMeaning: "Aspartate Aminotransferase: enzymes found in liver and muscle tissue.",
    whyItMatters: "22 U/L confirms healthy liver tissue without cellular strain.",
    lifestyleTips: "Well-balanced nutrition and rest after heavy training sessions keep AST optimal.",
    doctorDiscussPoint: "Normal AST.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_bilirubin",
    name: "Total Bilirubin",
    panel: "Hepatic",
    value: 0.7,
    unit: "mg/dL",
    minRange: 0.2,
    maxRange: 1.2,
    status: "normal",
    flagText: "Normal (0.2 - 1.2)",
    plainMeaning: "Yellow pigment from natural red blood cell turnover processed by liver into bile.",
    whyItMatters: "0.7 mg/dL reflects clear bile flow and healthy liver breakdown pathways.",
    lifestyleTips: "Include cruciferous vegetables (broccoli, cabbage) which naturally support liver clearance.",
    doctorDiscussPoint: "Normal biliary clearance.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_sodium",
    name: "Sodium",
    panel: "Metabolic",
    value: 140,
    unit: "mmol/L",
    minRange: 135,
    maxRange: 145,
    status: "optimal",
    flagText: "Optimal (135 - 145)",
    plainMeaning: "Essential electrolyte maintaining fluid volume, blood pressure, and neural signaling.",
    whyItMatters: "140 mmol/L sits dead-center in the physiological sweet spot.",
    lifestyleTips: "Balanced hydration maintains proper electrolyte balance.",
    doctorDiscussPoint: "Optimal electrolyte panel.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_potassium",
    name: "Potassium",
    panel: "Metabolic",
    value: 4.2,
    unit: "mmol/L",
    minRange: 3.5,
    maxRange: 5.0,
    status: "optimal",
    flagText: "Optimal (3.5 - 5.0)",
    plainMeaning: "Electrolyte inside cells regulating heart rhythm and vascular smooth muscle relaxation.",
    whyItMatters: "4.2 mmol/L provides robust cardiac rhythm stability.",
    lifestyleTips: "Leafy greens and bananas provide natural potassium.",
    doctorDiscussPoint: "Stable cardiac electrolyte balance.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_calcium",
    name: "Calcium (Serum)",
    panel: "Metabolic",
    value: 9.4,
    unit: "mg/dL",
    minRange: 8.5,
    maxRange: 10.2,
    status: "normal",
    flagText: "Normal (8.5 - 10.2)",
    plainMeaning: "Circulating mineral essential for bone strength, nerve impulses, and muscle contractions.",
    whyItMatters: "9.4 mg/dL confirms healthy parathyroid regulation and bone mineral balance.",
    lifestyleTips: "Maintain adequate Vitamin D to ensure calcium absorption.",
    doctorDiscussPoint: "Normal calcium level.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_wbc",
    name: "WBC (White Blood Cells)",
    panel: "Hematology",
    value: 6.4,
    unit: "k/uL",
    minRange: 4.5,
    maxRange: 11.0,
    status: "normal",
    flagText: "Normal (4.5 - 11.0)",
    plainMeaning: "Immune cells defending against infections and cellular inflammation.",
    whyItMatters: "6.4 k/uL confirms no active bacterial or viral infection, with normal immune baseline.",
    lifestyleTips: "Adequate sleep and low chronic stress protect immune balance.",
    doctorDiscussPoint: "Normal immune cell count.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
  {
    id: "bio_hemoglobin",
    name: "Hemoglobin",
    panel: "Hematology",
    value: 15.1,
    unit: "g/dL",
    minRange: 13.5,
    maxRange: 17.5,
    status: "optimal",
    flagText: "Optimal (13.5 - 17.5)",
    plainMeaning: "Iron protein carrying oxygen from lungs to muscles and brain.",
    whyItMatters: "15.1 g/dL rules out anemia and supports high aerobic stamina for your 150 min/week exercise goal.",
    lifestyleTips: "Dietary iron from lean poultry, spinach, and beans maintains healthy red cell reserves.",
    doctorDiscussPoint: "Optimal oxygen-carrying capacity.",
    dateRecorded: "October 27, 2026",
    labSource: "Quest Diagnostics Outpatient Phlebotomy",
  },
];

/**
 * Intelligent regex parser for raw laboratory portal text (Quest, Labcorp, Epic MyChart)
 */
export function parseLabReportText(text: string): BiomarkerResult[] {
  if (!text || text.trim().length === 0) return [];

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const results: BiomarkerResult[] = [];
  const nowStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    
    // Sort templates so more specific names (e.g. "Neutrophils Absolute", "Neutrophils %") are checked before general "Neutrophils"
    const templateEntries = Object.entries(STANDARD_BIOMARKER_TEMPLATES).sort(
      ([, a], [, b]) => b.name.length - a.name.length
    );

    for (const [key, template] of templateEntries) {
      const templateNameLower = template.name.toLowerCase();
      
      // Check for direct match or key terms
      const isPercentage = lineLower.includes("%");
      const isAbsolute = lineLower.includes("absolute") || lineLower.includes("abs");

      let matches = false;
      if (templateNameLower.includes("%")) {
        const baseName = templateNameLower.replace("%", "").trim();
        matches = lineLower.includes(baseName) && isPercentage;
      } else if (templateNameLower.includes("absolute")) {
        const baseName = templateNameLower.replace("absolute", "").trim();
        matches = lineLower.includes(baseName) && isAbsolute;
      } else {
        // Clean matching
        const cleanName = templateNameLower.replace(/[\(\)]/g, "").trim();
        matches = lineLower.includes(cleanName) || lineLower.startsWith(key.toLowerCase());
      }

      if (matches) {
        // Extract numbers from line
        const numMatches = line.match(/\b\d+(\.\d+)?\b/g);
        if (numMatches && numMatches.length > 0) {
          const val = parseFloat(numMatches[0]);
          if (!isNaN(val)) {
            // Avoid adding duplicates
            if (!results.some((r) => r.name.toLowerCase() === template.name.toLowerCase())) {
              // Check if line explicitly flags Low or High
              let manualStatus: BiomarkerStatus | undefined;
              let manualFlag: string | undefined;

              if (lineLower.includes("low")) {
                manualStatus = "low";
                manualFlag = "Low (Flagged)";
              } else if (lineLower.includes("high")) {
                manualStatus = "elevated";
                manualFlag = "High (Flagged)";
              }

              const statusInfo = computeBiomarkerStatus(
                val,
                template.minRange,
                template.maxRange,
                template.comparatorType || "range"
              );

              results.push({
                id: `parsed_${key}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                name: template.name,
                panel: template.panel,
                value: val,
                unit: template.unit,
                minRange: template.minRange,
                maxRange: template.maxRange,
                status: manualStatus || statusInfo.status,
                flagText: manualFlag || statusInfo.flagText,
                plainMeaning: template.plainMeaning,
                whyItMatters: template.whyItMatters,
                lifestyleTips: template.lifestyleTips,
                doctorDiscussPoint: template.doctorDiscussPoint,
                dateRecorded: nowStr,
                labSource: "Imported from Patient Portal Text",
              });
              break; // matched this line
            }
          }
        }
      }
    }
  }

  return results;
}
