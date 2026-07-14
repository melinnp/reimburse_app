# fix_api_base.py
import re, glob

pattern = re.compile(r"""fetch\((['"`])http://localhost:8000/api(.*?)\1""")

def repl(m):
    rest = m.group(2)
    return f"fetch(`${{APP_BASE}}{rest}`"

for path in glob.glob('public/Script/**/*.js', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content, count = pattern.subn(repl, content)
    if count:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"{path}: {count} diganti")