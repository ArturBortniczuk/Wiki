import sys
import re

file_path = r'd:\Github\Wiki\src\app\lobby\[id]\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_declaration = 'export default function LobbyPage() {'
new_declaration = "import { Suspense } from 'react';\n\nfunction LobbyContent() {"
content = content.replace(old_declaration, new_declaration)

wrapper = '''

export default function LobbyPage() {
    return (
        <Suspense fallback={<div className="loading-container"><div className="spinner"></div><h2 className="loading-text">ŁĄCZENIE Z SERWEREM...</h2></div>}>
            <LobbyContent />
        </Suspense>
    );
}
'''
content += wrapper

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
