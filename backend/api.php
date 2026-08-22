<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "thanjaiproperty_dbuser", "zo7yNf^Jf!SLh3f[", "thanjaiproperty_crm");
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
$conn->close();
?>