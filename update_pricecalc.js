const fs = require('fs');

let content = fs.readFileSync('src/components/PriceCalculator.tsx', 'utf8');

// Add new constants
content = content.replace('const ADDONS = [', `const CUSTOM_ROOFS = [
  { id: "ensidig", title: "Ensidet hældning", desc: "Moderne og stilrent look." },
  { id: "saddeltag", title: "Saddeltag", desc: "Klassisk sommerhus-følelse." },
  { id: "fladt", title: "Fladt tag", desc: "Minimalistisk og funktionelt." }
];

const CUSTOM_TIERS = [
  { id: "budget", title: "Budget / Lavstandard", desc: "Fokus på de mest nødvendige løsninger." },
  { id: "standard", title: "Standard", desc: "Vores anbefalede, langtidsholdbare løsning." },
  { id: "premium", title: "Premium / Højstandard", desc: "Eksklusive materialer og detaljer overalt." }
];

const ADDONS = [`);

// Add new states
content = content.replace('const [step, setStep] = useState(1);', `const [step, setStep] = useState(1);
  const [isCustomBuild, setIsCustomBuild] = useState(false);
  const [customM2, setCustomM2] = useState<string>("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [selectedRoof, setSelectedRoof] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);`);

// Update onSubmitLead to use FormData
content = content.replace(/const payload = {[\s\S]*?body: JSON.stringify\(payload\),/m, `const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("is_custom_build", isCustomBuild.toString());
    
    if (isCustomBuild) {
      if (customM2) formData.append("custom_m2", customM2);
      if (selectedRoof) formData.append("custom_roof", selectedRoof);
      if (selectedTier) formData.append("custom_tier", selectedTier);
      if (selectedFoundation) formData.append("options", JSON.stringify({ foundation: selectedFoundation }));
      if (customFile) formData.append("file", customFile);
    } else {
      formData.append("model_selected", model?.name || "Ingen");
      formData.append("options", JSON.stringify({ addons: selectedAddons, foundation: selectedFoundation }));
      formData.append("estimated_price_from", estimatedTotalMin.toString());
      formData.append("estimated_price_to", estimatedTotalMax.toString());
    }

    try {
      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        body: formData,`);
content = content.replace('headers: { "Content-Type": "application/json" },', '');

// Adjust step logic
content = content.replace(/setStep\(5\)/g, 'setStep(isCustomBuild ? 6 : 5)');
content = content.replace('Trin {step} af 5', 'Trin {step} af {isCustomBuild ? 6 : 5}');
content = content.replace('Math.min(5, s + 1)', 'Math.min(isCustomBuild ? 6 : 5, s + 1)');
content = content.replace(/step < 5/g, '(isCustomBuild ? step < 6 : step < 5)');

// Replace stepsConfig
content = content.replace(/const stepsConfig = \[[\s\S]*?\];/, `const stepsConfig = isCustomBuild ? [
    { title: "Plantegning", icon: Home },
    { title: "Fundament", icon: Droplets },
    { title: "Tag-type", icon: BoxSelect },
    { title: "Prisklasse", icon: BoxSelect },
    { title: "Oplysninger", icon: User },
    { title: "Oversigt", icon: ClipboardList },
  ] : [
    { title: "Model", icon: Home },
    { title: "Tilvalg", icon: BoxSelect },
    { title: "Fundament", icon: Droplets },
    { title: "Oplysninger", icon: User },
    { title: "Oversigt", icon: ClipboardList },
  ];`);

// Rewrite the steps area
const stepsRegex = /<div className="flex-1">[\s\S]*?{step === 5 && \([\s\S]*?Gå til forsiden\n              <\/Button>\n            <\/div>\n          \)}/;
content = content.replace(stepsRegex, `// REPLACED`);

fs.writeFileSync('src/components/PriceCalculator.tsx', content);
