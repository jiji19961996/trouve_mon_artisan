"""Generate the initial SQL seed from the supplied workbook (Python stdlib only)."""
from pathlib import Path
from decimal import Decimal
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(ROOT / 'data/artisans-source.xlsx') as z:
    strings = [''.join(t.itertext()) for t in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)]
    rows = []
    for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//m:row', NS):
        values = {}
        for cell in row.findall('m:c', NS):
            v = cell.find('m:v', NS)
            value = v.text if v is not None else ''
            if cell.get('t') == 's': value = strings[int(value)]
            if cell.get('t') == 'inlineStr': value = ''.join(cell.find('m:is', NS).itertext())
            values[''.join(x for x in cell.get('r') if x.isalpha())] = value
        if any(values.values()): rows.append(values)
assert [rows[0].get(c) for c in 'ABCDEFGHI'] == ['Nom', 'Spécialité', 'Note', 'Ville', 'A propos', 'Email', 'Site Web', 'Catégorie', 'Top']
records = rows[1:]
categories = {'Bâtiment': 1, 'Services': 2, 'Fabrication': 3, 'Alimentation': 4}
specialties = {}
for row in records:
    assert all(row.get(c) for c in 'ABCDEFHI'), 'Missing required value'
    assert row['H'] in categories
    assert Decimal('0') <= Decimal(row['C']) <= Decimal('5')
    assert row['I'] in ('0', '1')
    assert not row.get('G') or row['G'].startswith(('https://', 'http://'))
    previous = specialties.setdefault(row['B'], (len(specialties) + 1, categories[row['H']]))
    assert previous[1] == categories[row['H']], 'Specialty in multiple categories'
assert len(records) == 17 and sum(int(r['I']) for r in records) == 3

def sql(value):
    if value is None: return 'NULL'
    # Source contains no backslashes: standard doubled apostrophes are safe
    # with either default SQL mode or NO_BACKSLASH_ESCAPES.
    assert '\\' not in value and '\x00' not in value
    return "'" + value.replace("'", "''") + "'"

lines = ["-- Source : data/artisans-source.xlsx (data[1].xlsx), feuille data2.",
         '-- 17 artisans, 15 spécialités, 4 catégories, 3 artisans du mois.',
         '-- Initialisation uniquement : les trois tables doivent être vides.',
         '-- Aucun effacement automatique des données existantes.',
         'SET NAMES utf8mb4;', 'USE artisans;', 'START TRANSACTION;']
lines.append('INSERT INTO categories(id,name) VALUES\n' + ',\n'.join(f'({id},{sql(name)})' for name,id in categories.items()) + ';')
lines.append('INSERT INTO specialties(id,name,category_id) VALUES\n' + ',\n'.join(f'({id},{sql(name)},{cat})' for name,(id,cat) in specialties.items()) + ';')
values = []
for id,r in enumerate(records,1):
    values.append('(' + ','.join([str(id),sql(r['A']),str(Decimal(r['C'])),sql(r['D']),sql(r['E']),sql(r['F']),sql(r.get('G') or None),sql('/artisan.svg'),r['I'],str(specialties[r['B']][0])]) + ')')
lines.append('INSERT INTO artisans(id,name,rating,city,about,email,website,image,featured,specialty_id) VALUES\n' + ',\n'.join(values) + ';')
lines.append('COMMIT;')
(ROOT/'sql/02-seed.sql').write_text('\n'.join(lines)+'\n', encoding='utf-8')
print(f'{len(records)} artisans, {len(specialties)} spécialités, {len(categories)} catégories ; 3 Top.')
