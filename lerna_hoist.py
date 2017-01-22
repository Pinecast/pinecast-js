import json
import os
import shutil


packages = []
for p in os.listdir('./packages'):
    if p.startswith('.'):
        continue
    packages.append(p)

package_names = [json.load(open(os.path.join('packages', p, 'package.json')))['name'] for p in packages]


dep_map = {}

def found_dep(package, package_json_path):
    dep = json.load(open(os.path.join(package_json_path)))
    dep_name = (dep['name'], dep['version'])
    dep_map.setdefault(dep_name, []).append(package)


print 'Scanning %d packages...' % len(packages)
for package in packages:
    node_modules_path = os.path.join('packages', package, 'node_modules')
    for nm in os.listdir(node_modules_path):
        if nm.startswith('.'):
            continue

        nm_path = os.path.join(node_modules_path, nm)
        if os.path.islink(nm_path):
            if nm not in package_names:
                print 'Unknown symlink "%s" skipped in %s' % (nm, package)
            continue

        if nm.startswith('@'):
            for namespace_package in os.listdir(nm_path):
                if namespace_package.startswith('.'):
                    continue
                found_dep(package, os.path.join(nm_path, namespace_package, 'package.json'))
        else:
            found_dep(package, os.path.join(nm_path, 'package.json'))

# print {k: v for k, v in dep_map.items() if len(v) > 1}

print 'Common packages:', sum(1 for v in dep_map.values() if len(v) > 1)
print 'Lone packages:', sum(1 for v in dep_map.values() if len(v) < 2)

if not os.path.exists('lerna_modules'):
    print 'Making lerna_modules directory...'
    os.mkdir('lerna_modules')

deps_to_move = [(x, v) for x, v in dep_map.items() if len(v) > 1]
print 'Hoisting %d deps...' % len(deps_to_move)
for dependancy, dependants in deps_to_move:
    dep_name, dep_version = dependancy
    hoisted_from = dependants[0]
    hoist_from_path = os.path.join('packages', hoisted_from, 'node_modules', dep_name)

    # print 'move', hoist_from_path, 'lerna_modules'
    shutil.move(hoist_from_path, 'lerna_modules')
    target = os.path.join('lerna_modules', dep_name)
    for dependant in dependants:
        dep_hoist_path = os.path.join('packages', dependant, 'node_modules', dep_name)
        if dependant != hoisted_from:
            # print 'rmtree', dep_hoist_path
            shutil.rmtree(dep_hoist_path)

        # print 'symlink', target, dep_hoist_path
        os.symlink(target, dep_hoist_path)
