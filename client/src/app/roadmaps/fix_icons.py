import os

path = r'd:\websites\AI Interview Preparation Platform\client\src\app\roadmaps'
for root, dirs, files in os.walk(path):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = content.replace('ZapIcon', 'Zap')
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
