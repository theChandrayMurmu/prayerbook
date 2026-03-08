const fs = require('fs');
const path = require('path');

function checkFileCase(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.next') && !fullPath.includes('.git')) {
                checkFileCase(fullPath);
            }
        } else {
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
                let match;
                while ((match = importRegex.exec(content)) !== null) {
                    let importPath = match[1];
                    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
                        let actualPath = importPath;
                        if (importPath.startsWith('@/')) {
                            actualPath = path.join(process.cwd(), importPath.substring(2));
                        } else {
                            actualPath = path.join(path.dirname(fullPath), importPath);
                        }

                        let extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '.css'];
                        let found = false;
                        for (let ext of extensions) {
                            let testPath = actualPath + ext;
                            if (fs.existsSync(testPath)) {
                                // check exact case
                                let parts = testPath.split(path.sep);
                                let currentPath = '/';
                                let tempFound = true;
                                for (let i = 1; i < parts.length; i++) {
                                    if (!parts[i]) continue;
                                    let dirFiles = fs.readdirSync(currentPath);
                                    if (!dirFiles.includes(parts[i])) {
                                        console.error(`Case mismatch in ${fullPath}: import ${importPath} points to ${testPath} but exact case not found (${parts[i]})`);
                                        tempFound = false;
                                        break;
                                    }
                                    currentPath = path.join(currentPath, parts[i]);
                                }
                                if (tempFound) {
                                    found = true;
                                    break;
                                }
                            }
                        }

                        // Without extensions?
                        if (!found && fs.existsSync(actualPath) && !fs.statSync(actualPath).isDirectory()) {
                            let parts = actualPath.split(path.sep);
                            let currentPath = '/';
                            let tempFound = true;
                            for (let i = 1; i < parts.length; i++) {
                                if (!parts[i]) continue;
                                let dirFiles = fs.readdirSync(currentPath);
                                if (!dirFiles.includes(parts[i])) {
                                    console.error(`Case mismatch in ${fullPath}: import ${importPath} exact case not found (${parts[i]})`);
                                    tempFound = false;
                                    break;
                                }
                                currentPath = path.join(currentPath, parts[i]);
                            }
                            if (tempFound) {
                                found = true;
                            }
                        }

                        if (!found && !importPath.endsWith(".css")) {
                            console.log(`Could not resolve ${importPath} from ${fullPath}`);
                        }
                    }
                }
            }
        }
    });
}

checkFileCase('.');
