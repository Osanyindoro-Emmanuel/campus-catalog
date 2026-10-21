const testProduct = {
  title: "Vintage Oversized Graphic Tee",
  category: "Clothing",
  price: 6500,
  sizes: ["M", "L", "XL"],
  imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
  inStock: true
};

async function testCreate() {
  try {
    const response = await fetch("http://localhost:5000/api/v1/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testProduct)
    });

    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Created Record:", data);
  } catch (error) {
    console.error("Request Failed:", error.message);
  }
}

testCreate();