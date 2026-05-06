import os
import re

files_to_process = [
    "src/components/Navbar.tsx",
    "src/components/Footer.tsx",
    "src/components/TransitionOverlay.tsx"
]

replacements = {
    "#2A1F14": "#1E2B22",
    "#8B4A2B": "#587F66",
    "#7a4026": "#456952",
    "#F5EDE0": "#F3F5F4",
    "#EAD9C3": "#E4EBE6",
    "#D4B99A": "#BBD1C2",
    "#7A5C42": "#65806D",
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

print("Component colors replaced.")
