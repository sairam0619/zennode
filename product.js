const readline = require('readline');

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.quantity = 0;
  }

  calculateTotalPrice() {
    return this.quantity * this.price;
  }
}

class ShoppingCart {
  constructor() {
    this.products = {
      "Product A": new Product("Product A", 20),
      "Product B": new Product("Product B", 40),
      "Product C": new Product("Product C", 510),
    };
  }

  calculateSubtotal() {
    return Object.values(this.products).reduce((total, product) => {
      return total + product.calculateTotalPrice();
    }, 0);
  }

  applyDiscount() {
    const totalQuantity = Object.values(this.products).reduce(
      (total, product) => total + product.quantity,
      0
    );
    const maxQuantity = Math.max(...Object.values(this.products).map((p) => p.quantity));

    // Discount Rules
    if (totalQuantity > 30 && maxQuantity > 15) {
      return ["tiered_50_discount", this.calculateSubtotal() * 0.5];
    } else if (totalQuantity > 20) {
      return ["bulk_10_discount", this.calculateSubtotal() * 0.1];
    } else if (Object.values(this.products).some((p) => p.quantity > 10)) {
      const discountedProduct = Object.values(this.products).find((p) => p.quantity > 10);
      return ["bulk_5_discount", discountedProduct.calculateTotalPrice() * 0.05];
    } else if (this.calculateSubtotal() > 200) {
      return ["flat_10_discount", 10];
    } else {
      return [null, 0];
    }
  }

  calculateTotal(discountAmount, giftWrapFee, shippingFee) {
    return (
      this.calculateSubtotal() - discountAmount + giftWrapFee + shippingFee
    );
  }

  displayReceipt() {
    console.log("Product Name | Quantity | Total Amount");
    console.log("---------------------------------------");
    Object.values(this.products).forEach((product) => {
      console.log(
        `${product.name} | ${product.quantity} | $${product.calculateTotalPrice()}`
      );
    });

    const subtotal = this.calculateSubtotal();
    const [discountName, discountAmount] = this.applyDiscount();
    const giftWrapFee = Object.values(this.products).reduce(
      (total, product) => total + product.quantity, 0
    ) * 1; // $1 per unit for gift wrap
    const shippingFee = Math.floor(subtotal / 10) * 5; // 10 units per package, $5 per package

    console.log("\nSubtotal:", `$${subtotal}`);
    console.log(
      "Discount Applied:",
      `${discountName} - $${discountAmount}`
    );
    console.log("Gift Wrap Fee:", `$${giftWrapFee}`);
    console.log("Shipping Fee:", `$${shippingFee}`);
    console.log("\nTotal:", `$${this.calculateTotal(discountAmount, giftWrapFee, shippingFee)}`);
  }
}

async function main() {
  const cart = new ShoppingCart();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const getProductQuantity = (productName) => new Promise((resolve) => {
    rl.question(`Enter the quantity of ${productName}: `, (quantity) => {
      resolve(parseInt(quantity, 10));
    });
  });

  const getGiftWrapPreference = (productName) => new Promise((resolve) => {
    rl.question(`Is ${productName} wrapped as a gift? (yes/no): `, (giftWrap) => {
      resolve(giftWrap.toLowerCase() === 'yes');
    });
  });

  const processProduct = async (productName) => {
    const quantity = await getProductQuantity(productName);
    cart.products[productName].quantity = quantity;

    const isGiftWrap = await getGiftWrapPreference(productName);
    if (isGiftWrap) {
      cart.products[productName].quantity += quantity; // Adding gift wrap fee
    }
  };

  const processAllProducts = async () => {
    for (const productName in cart.products) {
      await processProduct(productName);
    }
    rl.close();
  };

  await processAllProducts();
  cart.displayReceipt();
}

main();

