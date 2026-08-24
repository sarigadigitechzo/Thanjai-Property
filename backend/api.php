<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "thanjaiproperty_thanjaiproperty", "q-i_$^HnE{OnhY%E", "thanjaiproperty_crm");
if ($conn->connect_error) {
    echo json_encode(["error" => "Database Connection failed"]);
    exit();
}

$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Parse URL
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = array_values(array_filter(explode('/', trim($path, '/'))));
$resource = isset($path_parts[1]) ? $path_parts[1] : '';
$id = isset($path_parts[2]) ? $path_parts[2] : null;

if ($resource === 'properties') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM properties ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO properties (id, title, type, category, categoryRaw, categoryLabel, purpose, price, priceFormatted, location, district, address, size, bedrooms, bathrooms, furnishing, status, availability, latitude, longitude, videoUrl, ownerName, ownerPhone, listedBy, images, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $stmt->bind_param("sssssssdsssssiissssssssssss", $data['id'], $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $images, $data['description'], $features);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Property created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE properties SET title=?, type=?, category=?, categoryRaw=?, categoryLabel=?, purpose=?, price=?, priceFormatted=?, location=?, district=?, address=?, size=?, bedrooms=?, bathrooms=?, furnishing=?, status=?, availability=?, latitude=?, longitude=?, videoUrl=?, ownerName=?, ownerPhone=?, listedBy=?, images=?, description=?, features=? WHERE id=?");
        $images = json_encode($data['images'] ?? []);
        $features = json_encode($data['features'] ?? []);
        $stmt->bind_param("ssssssdsssssiisssssssssssss", $data['title'], $data['type'], $data['category'], $data['categoryRaw'], $data['categoryLabel'], $data['purpose'], $data['price'], $data['priceFormatted'], $data['location'], $data['district'], $data['address'], $data['size'], $data['bedrooms'], $data['bathrooms'], $data['furnishing'], $data['status'], $data['availability'], $data['latitude'], $data['longitude'], $data['videoUrl'], $data['ownerName'], $data['ownerPhone'], $data['listedBy'], $images, $data['description'], $features, $id);
        $stmt->execute();
        echo json_encode(["message" => "Property updated successfully"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM properties WHERE id=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode(["message" => "Property deleted successfully"]);
    }
} 
elseif ($resource === 'leads') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM leads ORDER BY createdAt DESC");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("INSERT INTO leads (id, name, phone, email, source, status, budget, requirement, location, timeline, assignedTo, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssssss", $data['id'], $data['name'], $data['phone'], $data['email'], $data['source'], $data['status'], $data['budget'], $data['requirement'], $data['location'], $data['timeline'], $data['assignedTo'], $data['notes']);
        $stmt->execute();
        echo json_encode(["message" => "Lead created successfully"]);
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $conn->prepare("UPDATE leads SET name=?, phone=?, email=?, source=?, status=?, budget=?, requirement=?, location=?, timeline=?, assignedTo=?, notes=? WHERE id=?");
        $stmt->bind_param("ssssssssssss", $data['name'], $data['phone'], $data['email'], $data['source'], $data['status'], $data['budget'], $data['requirement'], $data['location'], $data['timeline'], $data['assignedTo'], $data['notes'], $id);
        $stmt->execute();
        echo json_encode(["message" => "Lead updated successfully"]);
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM leads WHERE id=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        echo json_encode(["message" => "Lead deleted successfully"]);
    }
}

elseif ($resource === 'blog') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM blog_posts");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO blog_posts (id, slug, title, category, date, readTime, author, authorAvatar, image, excerpt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssssss", $data['id'], $data['slug'], $data['title'], $data['category'], $data['date'], $data['readTime'], $data['author'], $data['authorAvatar'], $data['image'], $data['excerpt'], $data['content']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE blog_posts SET slug=?, title=?, category=?, date=?, readTime=?, author=?, authorAvatar=?, image=?, excerpt=?, content=? WHERE id=?");
        $stmt->bind_param("sssssssssss", $data['slug'], $data['title'], $data['category'], $data['date'], $data['readTime'], $data['author'], $data['authorAvatar'], $data['image'], $data['excerpt'], $data['content'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'categories') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM categories");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO categories (id, name, unitSingular, unitPlural, defaultImage, description) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['name'], $data['unitSingular'], $data['unitPlural'], $data['defaultImage'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE categories SET name=?, unitSingular=?, unitPlural=?, defaultImage=?, description=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['unitSingular'], $data['unitPlural'], $data['defaultImage'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM categories WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'locations') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM locations");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $data['popularAreas'] = json_encode($data['popularAreas'] ?? []);
        
        $stmt = $conn->prepare("INSERT INTO locations (id, name, tagline, defaultImage, popularAreas, description) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['name'], $data['tagline'], $data['defaultImage'], $data['popularAreas'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $data['popularAreas'] = json_encode($data['popularAreas'] ?? []);
        
        $stmt = $conn->prepare("UPDATE locations SET name=?, tagline=?, defaultImage=?, popularAreas=?, description=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['tagline'], $data['defaultImage'], $data['popularAreas'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM locations WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'agents') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM agents");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO agents (id, name, role, company, experience, phone, whatsapp, email, activeListings, location, image, specialty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssisss", $data['id'], $data['name'], $data['role'], $data['company'], $data['experience'], $data['phone'], $data['whatsapp'], $data['email'], $data['activeListings'], $data['location'], $data['image'], $data['specialty']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE agents SET name=?, role=?, company=?, experience=?, phone=?, whatsapp=?, email=?, activeListings=?, location=?, image=?, specialty=? WHERE id=?");
        $stmt->bind_param("sssssssissss", $data['name'], $data['role'], $data['company'], $data['experience'], $data['phone'], $data['whatsapp'], $data['email'], $data['activeListings'], $data['location'], $data['image'], $data['specialty'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM agents WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'site_images') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM site_images");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO site_images (id, title, category, recommendedWidth, recommendedHeight, aspectRatio, format, maxSize, defaultUrl, currentUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiissssss", $data['id'], $data['title'], $data['category'], $data['recommendedWidth'], $data['recommendedHeight'], $data['aspectRatio'], $data['format'], $data['maxSize'], $data['defaultUrl'], $data['currentUrl'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE site_images SET title=?, category=?, recommendedWidth=?, recommendedHeight=?, aspectRatio=?, format=?, maxSize=?, defaultUrl=?, currentUrl=?, description=? WHERE id=?");
        $stmt->bind_param("ssiisssssss", $data['title'], $data['category'], $data['recommendedWidth'], $data['recommendedHeight'], $data['aspectRatio'], $data['format'], $data['maxSize'], $data['defaultUrl'], $data['currentUrl'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM site_images WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'admin_users') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM admin_users");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $data['allowedModules'] = json_encode($data['allowedModules'] ?? []);
        $stmt = $conn->prepare("INSERT INTO admin_users (id, fullName, email, phone, password, role, roleCode, status, lastLogin, allowedModules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $data['id'], $data['fullName'], $data['email'], $data['phone'], $data['password'], $data['role'], $data['roleCode'], $data['status'], $data['lastLogin'], $data['allowedModules']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        $data['allowedModules'] = json_encode($data['allowedModules'] ?? []);
        $stmt = $conn->prepare("UPDATE admin_users SET fullName=?, email=?, phone=?, password=?, role=?, roleCode=?, status=?, lastLogin=?, allowedModules=? WHERE id=?");
        $stmt->bind_param("ssssssssss", $data['fullName'], $data['email'], $data['phone'], $data['password'], $data['role'], $data['roleCode'], $data['status'], $data['lastLogin'], $data['allowedModules'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM admin_users WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'partners') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM partners");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO partners (id, name, type, phone, email, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['name'], $data['type'], $data['phone'], $data['email'], $data['status']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE partners SET name=?, type=?, phone=?, email=?, status=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['type'], $data['phone'], $data['email'], $data['status'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM partners WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'shared_leads') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM shared_leads");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO shared_leads (id, leadId, partnerId, status) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $data['id'], $data['leadId'], $data['partnerId'], $data['status']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE shared_leads SET leadId=?, partnerId=?, status=? WHERE id=?");
        $stmt->bind_param("ssss", $data['leadId'], $data['partnerId'], $data['status'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM shared_leads WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'site_visits') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM site_visits");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO site_visits (id, leadId, propertyId, visitDate, status, assignedTo, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $data['id'], $data['leadId'], $data['propertyId'], $data['visitDate'], $data['status'], $data['assignedTo'], $data['notes']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE site_visits SET leadId=?, propertyId=?, visitDate=?, status=?, assignedTo=?, notes=? WHERE id=?");
        $stmt->bind_param("sssssss", $data['leadId'], $data['propertyId'], $data['visitDate'], $data['status'], $data['assignedTo'], $data['notes'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM site_visits WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'audit_logs') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM audit_logs");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO audit_logs (id, timestamp, user, action, module, details) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $data['id'], $data['timestamp'], $data['user'], $data['action'], $data['module'], $data['details']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE audit_logs SET timestamp=?, user=?, action=?, module=?, details=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['timestamp'], $data['user'], $data['action'], $data['module'], $data['details'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM audit_logs WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'whatsapp_logs') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM whatsapp_logs");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO whatsapp_logs (id, sender, phone, message) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $data['id'], $data['sender'], $data['phone'], $data['message']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE whatsapp_logs SET sender=?, phone=?, message=? WHERE id=?");
        $stmt->bind_param("ssss", $data['sender'], $data['phone'], $data['message'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM whatsapp_logs WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'portal_users') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM portal_users");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO portal_users (id, fullName, email, phone, role, roleCode, status, propertiesCount, visitorsCount, buyersCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssiii", $data['id'], $data['fullName'], $data['email'], $data['phone'], $data['role'], $data['roleCode'], $data['status'], $data['propertiesCount'], $data['visitorsCount'], $data['buyersCount']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE portal_users SET fullName=?, email=?, phone=?, role=?, roleCode=?, status=?, propertiesCount=?, visitorsCount=?, buyersCount=? WHERE id=?");
        $stmt->bind_param("ssssssiiis", $data['fullName'], $data['email'], $data['phone'], $data['role'], $data['roleCode'], $data['status'], $data['propertiesCount'], $data['visitorsCount'], $data['buyersCount'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM portal_users WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

elseif ($resource === 'property_approvals') {
    if ($method === 'GET') {
        $result = $conn->query("SELECT * FROM property_approvals");
        $rows = [];
        while($row = $result->fetch_assoc()) { $rows[] = $row; }
        echo json_encode($rows);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("INSERT INTO property_approvals (id, propertyId, requestedBy, status, comments) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $data['id'], $data['propertyId'], $data['requestedBy'], $data['status'], $data['comments']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'PUT' && $id) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        
        $stmt = $conn->prepare("UPDATE property_approvals SET propertyId=?, requestedBy=?, status=?, comments=? WHERE id=?");
        $stmt->bind_param("sssss", $data['propertyId'], $data['requestedBy'], $data['status'], $data['comments'], $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
    elseif ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare("DELETE FROM property_approvals WHERE id=?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $stmt->error]);
        }
    }
}

$conn->close();
?>