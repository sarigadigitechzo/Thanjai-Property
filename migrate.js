import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock browser APIs for imports
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.window = { dispatchEvent: () => {} };
global.CustomEvent = class CustomEvent {};
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });

// Import seed data
import { INITIAL_BLOG_POSTS } from './src/utils/blogStore.js';
import { CATEGORIES } from './src/data/categories.js';
import { LOCATIONS } from './src/data/locations.js';
import { AGENTS } from './src/data/agents.js';
import { DEFAULT_SITE_IMAGES } from './src/utils/siteImagesStore.js';
import { getAdminUsers } from './src/utils/adminUsersStore.js';
import { getRegisteredUsers } from './src/utils/userAuthStore.js';

const adminUsers = getAdminUsers();
const portalUsers = getRegisteredUsers();

function escapeSql(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
}

let sql = `
-- Schemas
CREATE TABLE IF NOT EXISTS blog_posts (id VARCHAR(100) PRIMARY KEY, slug VARCHAR(255), title VARCHAR(255), category VARCHAR(100), date VARCHAR(50), readTime VARCHAR(50), author VARCHAR(100), authorAvatar VARCHAR(255), image VARCHAR(255), excerpt TEXT, content TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS categories (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), unitSingular VARCHAR(100), unitPlural VARCHAR(100), defaultImage VARCHAR(255), description TEXT);
CREATE TABLE IF NOT EXISTS locations (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), tagline VARCHAR(255), defaultImage VARCHAR(255), popularAreas JSON, description TEXT);
CREATE TABLE IF NOT EXISTS agents (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), role VARCHAR(255), company VARCHAR(255), experience VARCHAR(100), phone VARCHAR(50), whatsapp VARCHAR(50), email VARCHAR(255), activeListings INT, location VARCHAR(255), image VARCHAR(255), specialty VARCHAR(255));
CREATE TABLE IF NOT EXISTS site_images (id VARCHAR(100) PRIMARY KEY, title VARCHAR(255), category VARCHAR(100), recommendedWidth INT, recommendedHeight INT, aspectRatio VARCHAR(50), format VARCHAR(100), maxSize VARCHAR(50), defaultUrl VARCHAR(255), currentUrl VARCHAR(255), description TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id VARCHAR(100) PRIMARY KEY, fullName VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), password VARCHAR(255), role VARCHAR(100), roleCode VARCHAR(100), status VARCHAR(50), lastLogin VARCHAR(100), allowedModules JSON, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS partners (id VARCHAR(100) PRIMARY KEY, name VARCHAR(255), type VARCHAR(100), phone VARCHAR(50), email VARCHAR(255), status VARCHAR(50), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS shared_leads (id VARCHAR(100) PRIMARY KEY, leadId VARCHAR(100), partnerId VARCHAR(100), status VARCHAR(50), sharedAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS site_visits (id VARCHAR(100) PRIMARY KEY, leadId VARCHAR(100), propertyId VARCHAR(100), visitDate DATETIME, status VARCHAR(50), assignedTo VARCHAR(100), notes TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_logs (id VARCHAR(100) PRIMARY KEY, timestamp VARCHAR(100), user VARCHAR(255), action VARCHAR(255), module VARCHAR(255), details TEXT);
CREATE TABLE IF NOT EXISTS whatsapp_logs (id VARCHAR(100) PRIMARY KEY, sender VARCHAR(255), phone VARCHAR(50), message TEXT, receivedAt DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS portal_users (id VARCHAR(100) PRIMARY KEY, fullName VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), role VARCHAR(100), roleCode VARCHAR(100), status VARCHAR(50), propertiesCount INT, visitorsCount INT, buyersCount INT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS property_approvals (id VARCHAR(100) PRIMARY KEY, propertyId VARCHAR(100), requestedBy VARCHAR(100), status VARCHAR(50), comments TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);

-- Inserts
`;

for (let post of INITIAL_BLOG_POSTS) {
    sql += `INSERT IGNORE INTO blog_posts (id, slug, title, category, date, readTime, author, authorAvatar, image, excerpt, content) VALUES ('${escapeSql(post.id)}', '${escapeSql(post.slug)}', '${escapeSql(post.title)}', '${escapeSql(post.category)}', '${escapeSql(post.date)}', '${escapeSql(post.readTime)}', '${escapeSql(post.author)}', '${escapeSql(post.authorAvatar)}', '${escapeSql(post.image)}', '${escapeSql(post.excerpt)}', '${escapeSql(post.content)}');\n`;
}

for (let cat of CATEGORIES) {
    sql += `INSERT IGNORE INTO categories (id, name, unitSingular, unitPlural, defaultImage, description) VALUES ('${escapeSql(cat.id)}', '${escapeSql(cat.name)}', '${escapeSql(cat.unitSingular)}', '${escapeSql(cat.unitPlural)}', '${escapeSql(cat.defaultImage)}', '${escapeSql(cat.description)}');\n`;
}

for (let loc of LOCATIONS) {
    sql += `INSERT IGNORE INTO locations (id, name, tagline, defaultImage, popularAreas, description) VALUES ('${escapeSql(loc.id)}', '${escapeSql(loc.name)}', '${escapeSql(loc.tagline)}', '${escapeSql(loc.defaultImage)}', '${escapeSql(JSON.stringify(loc.popularAreas))}', '${escapeSql(loc.description)}');\n`;
}

for (let agent of AGENTS) {
    sql += `INSERT IGNORE INTO agents (id, name, role, company, experience, phone, whatsapp, email, activeListings, location, image, specialty) VALUES ('${escapeSql(agent.id)}', '${escapeSql(agent.name)}', '${escapeSql(agent.role)}', '${escapeSql(agent.company)}', '${escapeSql(agent.experience)}', '${escapeSql(agent.phone)}', '${escapeSql(agent.whatsapp)}', '${escapeSql(agent.email)}', ${agent.activeListings}, '${escapeSql(agent.location)}', '${escapeSql(agent.image)}', '${escapeSql(agent.specialty)}');\n`;
}

for (let key in DEFAULT_SITE_IMAGES) {
    let img = DEFAULT_SITE_IMAGES[key];
    sql += `INSERT IGNORE INTO site_images (id, title, category, recommendedWidth, recommendedHeight, aspectRatio, format, maxSize, defaultUrl, currentUrl, description) VALUES ('${escapeSql(key)}', '${escapeSql(img.title)}', '${escapeSql(img.category)}', ${img.recommendedWidth || 0}, ${img.recommendedHeight || 0}, '${escapeSql(img.aspectRatio)}', '${escapeSql(img.format)}', '${escapeSql(img.maxSize)}', '${escapeSql(img.defaultUrl)}', '${escapeSql(img.defaultUrl)}', '${escapeSql(img.description)}');\n`;
}

for (let user of adminUsers) {
    sql += `INSERT IGNORE INTO admin_users (id, fullName, email, phone, password, role, roleCode, status, lastLogin, allowedModules, createdAt) VALUES ('${escapeSql(user.id)}', '${escapeSql(user.fullName)}', '${escapeSql(user.email)}', '${escapeSql(user.phone)}', '${escapeSql(user.password)}', '${escapeSql(user.role)}', '${escapeSql(user.roleCode)}', '${escapeSql(user.status)}', '${escapeSql(user.lastLogin)}', '[]', '${escapeSql(user.createdAt)}');\n`;
}

for (let user of portalUsers) {
    sql += `INSERT IGNORE INTO portal_users (id, fullName, email, phone, role, roleCode, status, propertiesCount, visitorsCount, buyersCount, createdAt) VALUES ('${escapeSql(user.id)}', '${escapeSql(user.fullName)}', '${escapeSql(user.email)}', '${escapeSql(user.phone)}', '${escapeSql(user.role)}', '${escapeSql(user.roleCode)}', '${escapeSql(user.status)}', ${user.propertiesCount || 0}, ${user.visitorsCount || 0}, ${user.buyersCount || 0}, '${escapeSql(user.createdAt)}');\n`;
}

let initSqlPath = path.join(__dirname, 'backend', 'init.sql');
fs.appendFileSync(initSqlPath, '\n' + sql);
console.log('Appended schemas and seed data to init.sql');

// Generate PHP endpoints
const entities = [
    { res: 'blog', table: 'blog_posts', cols: ['id', 'slug', 'title', 'category', 'date', 'readTime', 'author', 'authorAvatar', 'image', 'excerpt', 'content'] },
    { res: 'categories', table: 'categories', cols: ['id', 'name', 'unitSingular', 'unitPlural', 'defaultImage', 'description'] },
    { res: 'locations', table: 'locations', cols: ['id', 'name', 'tagline', 'defaultImage', 'popularAreas', 'description'] },
    { res: 'agents', table: 'agents', cols: ['id', 'name', 'role', 'company', 'experience', 'phone', 'whatsapp', 'email', 'activeListings', 'location', 'image', 'specialty'] },
    { res: 'site_images', table: 'site_images', cols: ['id', 'title', 'category', 'recommendedWidth', 'recommendedHeight', 'aspectRatio', 'format', 'maxSize', 'defaultUrl', 'currentUrl', 'description'] },
    { res: 'admin_users', table: 'admin_users', cols: ['id', 'fullName', 'email', 'phone', 'password', 'role', 'roleCode', 'status', 'lastLogin', 'allowedModules'] },
    { res: 'partners', table: 'partners', cols: ['id', 'name', 'type', 'phone', 'email', 'status'] },
    { res: 'shared_leads', table: 'shared_leads', cols: ['id', 'leadId', 'partnerId', 'status'] },
    { res: 'site_visits', table: 'site_visits', cols: ['id', 'leadId', 'propertyId', 'visitDate', 'status', 'assignedTo', 'notes'] },
    { res: 'audit_logs', table: 'audit_logs', cols: ['id', 'timestamp', 'user', 'action', 'module', 'details'] },
    { res: 'whatsapp_logs', table: 'whatsapp_logs', cols: ['id', 'sender', 'phone', 'message'] },
    { res: 'portal_users', table: 'portal_users', cols: ['id', 'fullName', 'email', 'phone', 'role', 'roleCode', 'status', 'propertiesCount', 'visitorsCount', 'buyersCount'] },
    { res: 'property_approvals', table: 'property_approvals', cols: ['id', 'propertyId', 'requestedBy', 'status', 'comments'] }
];

let php = '';
for (let e of entities) {
    let typeStr = e.cols.map(c => ['activeListings', 'recommendedWidth', 'recommendedHeight', 'propertiesCount', 'visitorsCount', 'buyersCount'].includes(c) ? 'i' : 's').join('');
    let paramMarks = e.cols.map(c => '?').join(', ');
    let bindParams = e.cols.map(c => "$data['" + c + "']").join(', ');
    let upCol = e.cols.slice(1).map(c => c + '=?').join(', ');
    let upBindParams = e.cols.slice(1).map(c => "$data['" + c + "']").join(', ');
    let typeStrUp = e.cols.slice(1).map(c => ['activeListings', 'recommendedWidth', 'recommendedHeight', 'propertiesCount', 'visitorsCount', 'buyersCount'].includes(c) ? 'i' : 's').join('') + 's';

    php += `
elseif ($resource === '${e.res}') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM ${e.table}");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        ${e.cols.includes('popularAreas') ? "$data['popularAreas'] = json_encode($data['popularAreas'] ?? []);" : ""}
        ${e.cols.includes('allowedModules') ? "$data['allowedModules'] = json_encode($data['allowedModules'] ?? []);" : ""}
        $stmt = $conn->prepare("INSERT INTO ${e.table} (${e.cols.join(', ')}) VALUES (${paramMarks})");
        $stmt->bind_param("${typeStr}", ${bindParams});
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        ${e.cols.includes('popularAreas') ? "$data['popularAreas'] = json_encode($data['popularAreas'] ?? []);" : ""}
        ${e.cols.includes('allowedModules') ? "$data['allowedModules'] = json_encode($data['allowedModules'] ?? []);" : ""}
        $stmt = $conn->prepare("UPDATE ${e.table} SET ${upCol} WHERE id=?");
        $stmt->bind_param("${typeStrUp}", ${upBindParams}, $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM ${e.table} WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}
`;
}

let apiPhpPath = path.join(__dirname, 'backend', 'api.php');
let apiPhp = fs.readFileSync(apiPhpPath, 'utf8');
apiPhp = apiPhp.replace(/\$conn->close\(\);[\r\n]+\?>/g, php + '\n$conn->close();\n?>');
fs.writeFileSync(apiPhpPath, apiPhp);
console.log('Appended CRUD endpoints to api.php');
