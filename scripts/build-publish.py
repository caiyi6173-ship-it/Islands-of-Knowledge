"""Build a publish-only copy of the site: entry HTML, src/ and the assets that
are actually referenced. Keeps deploy uploads small and leaves logs, screenshots
and test output out of the public copy.
"""
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "publish")
ENTRIES = ["index.html", "学科脉络地图.html"]
SCAN_DIRS = ["src"]
ALWAYS = ["assets/prologue"]
ALWAYS = ["assets/prologue"]
REF = re.compile(r"\.?/?assets/[A-Za-z0-9_./\-]+\.(?:png|jpg|jpeg|svg|mp3|wav|json|txt)")


def main():
    os.makedirs(OUT, exist_ok=True)

    for name in ENTRIES:
        shutil.copy2(os.path.join(ROOT, name), os.path.join(OUT, name))

    src_dst = os.path.join(OUT, "src")
    shutil.copytree(os.path.join(ROOT, "src"), src_dst, dirs_exist_ok=True)

    refs = set()
    scan = [os.path.join(ROOT, n) for n in ENTRIES]
    for d in SCAN_DIRS:
        for base, _, files in os.walk(os.path.join(ROOT, d)):
            scan += [os.path.join(base, f) for f in files if f.endswith((".css", ".js"))]
    for path in scan:
        with open(path, encoding="utf-8", errors="ignore") as fh:
            for m in REF.findall(fh.read()):
                refs.add(m.replace("./", "").lstrip("/"))

    missing = []
    copied = 0
    for rel in sorted(refs):
        source = os.path.join(ROOT, rel)
        if not os.path.isfile(source):
            missing.append(rel)
            continue
        dest = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(source, dest)
        copied += 1

    for folder in ALWAYS:
        source = os.path.join(ROOT, folder)
        dest = os.path.join(OUT, folder)
        if os.path.isdir(source):
            shutil.copytree(source, dest, dirs_exist_ok=True)
            copied += len(os.listdir(source))

    for folder in ALWAYS:
        source = os.path.join(ROOT, folder)
        dest = os.path.join(OUT, folder)
        if os.path.isdir(source):
            shutil.copytree(source, dest, dirs_exist_ok=True)
            copied += len(os.listdir(source))

    total = sum(
        os.path.getsize(os.path.join(b, f))
        for b, _, fs in os.walk(OUT)
        for f in fs
    )
    print(f"assets copied: {copied}")
    print(f"missing refs: {len(missing)}")
    for m in missing[:10]:
        print("  !", m)
    print(f"publish size: {total // 1024 // 1024} MB")


if __name__ == "__main__":
    main()
