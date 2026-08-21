import os
import glob

search_text = '<span className="w-1 h-1 shrink-0 rounded-full bg-current" />'
replace_text = ''

files = glob.glob('c:/new-trimify-front-admin/trimify-admin/src/**/*.jsx', recursive=True)
count = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if search_text in content:
        content = content.replace(search_text, replace_text)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
        count += 1
print(f'Done updating {count} files.')
