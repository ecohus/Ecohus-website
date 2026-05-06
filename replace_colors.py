import os
import re

files_to_process = [
    "src/app/renovering/page.tsx",
    "src/app/renovering/kontakt/page.tsx",
    "src/app/globals.css"
]

replacements = {
    "#2A1F14": "#1E2B22",
    "#3d2b1f": "#2C3E33",
    "#4a3020": "#1E2B22",
    "#5c3d2a": "#3A4F41",
    "#7a4026": "#456952",
    "#7a5538": "#4A6050",
    "#7A5C42": "#65806D",
    "#7a6356": "#65806D",
    "#8B4A2B": "#587F66",
    "#9e8472": "#87A190",
    "#b8906b": "#87A190",
    "#C9A882": "#A2BDAA",
    "#c4b09a": "#A2BDAA",
    "#D4B99A": "#BBD1C2",
    "#d4b69a": "#BBD1C2",
    "#EAD9C3": "#E4EBE6",
    "#F5EDE0": "#F3F5F4",
    "#f5ede0": "#F3F5F4",
    
    # Also update stats
    'value: "200+", label: "Tilfredse kunder"': 'value: "70+", label: "Tilfredse kunder"',
    'value: "4.9", label: "Gennemsnitlig bedømmelse"': 'value: "100%", label: "Kvalitetsgaranti"'
}

for file_path in files_to_process:
    with open(file_path, "r") as f:
        content = f.read()
    
    for old, new in replacements.items():
        # Case insensitive replace for hex colors
        if old.startswith("#"):
            content = re.sub(old, new, content, flags=re.IGNORECASE)
        else:
            content = content.replace(old, new)
            
    with open(file_path, "w") as f:
        f.write(content)

print("Colors and KPIs replaced.")
