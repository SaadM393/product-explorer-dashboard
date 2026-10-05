// Product data, grouped by category (nested, like a real catalog).
// "icon" is an emoji used when a product has no image or the image fails to load.
const storeData = {
  categories: [
    {
      name: "Computers",
      products: [
        { id: 1, name: "Laptop", brand: "NovaTech", price: 54999, rating: 4.5, reviews: 1280, icon: "💻", image: "assets/products/laptop.jpg", description: "14-inch lightweight laptop with 16GB RAM and a 512GB SSD." },
        { id: 4, name: "Monitor", brand: "ViewMax", price: 12999, rating: 4.3, reviews: 640, icon: "🖥️", image: "assets/products/monitor.jpg", description: "24-inch Full HD IPS monitor with thin bezels." }
      ]
    },
    {
      name: "Accessories",
      products: [
        { id: 2, name: "Mouse", brand: "ClickPro", price: 799, rating: 4.1, reviews: 2210, icon: "🖱️", image: "assets/products/mouse.jpg", description: "Wireless ergonomic mouse with silent clicks." },
        { id: 3, name: "Keyboard", brand: "KeyForge", price: 2499, rating: 4.6, reviews: 915, icon: "⌨️", image: "assets/products/keyboard.jpg", description: "Mechanical keyboard with backlight and blue switches." },
        { id: 5, name: "Headphones", brand: "SoundWave", price: 3999, rating: 4.4, reviews: 1830, icon: "🎧", image: "assets/products/headphones.jpg", description: "Over-ear Bluetooth headphones with 30 hours of battery." }
      ]
    },
    {
      name: "Mobiles",
      products: [
        { id: 6, name: "Phone", brand: "Zenith", price: 19999, rating: 4.2, reviews: 3120, icon: "📱", image: "assets/products/phone.jpg", description: "6.5-inch AMOLED phone with a 50MP camera." },
        { id: 7, name: "Smart Watch", brand: "Zenith", price: 4499, icon: "⌚", image: "assets/products/smart-watch.jpg", description: "Fitness tracker watch. (No rating yet: tests missing data.)" }
      ]
    }
  ]
};
