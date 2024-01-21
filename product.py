class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price
        self.quantity = 0

    def calculate_total_price(self):
        return self.quantity * self.price


class ShoppingCart:
    def __init__(self):
        self.products = {
            "Product A": Product("Product A", 20),
            "Product B": Product("Product B", 40),
            "Product C": Product("Product C", 50),
        }

    def calculate_subtotal(self):
        return sum(product.calculate_total_price() for product in self.products.values())

    def apply_discount(self):
        total_quantity = sum(product.quantity for product in self.products.values())
        max_quantity = max(product.quantity for product in self.products.values())
        
        # Discount Rules
        if total_quantity > 30 and max_quantity > 15:
            return "tiered_50_discount", self.calculate_subtotal() * 0.5
        elif total_quantity > 20:
            return "bulk_10_discount", self.calculate_subtotal() * 0.1
        elif any(product.quantity > 10 for product in self.products.values()):
            discounted_product = next(product for product in self.products.values() if product.quantity > 10)
            return "bulk_5_discount", discounted_product.calculate_total_price() * 0.05
        elif self.calculate_subtotal() > 200:
            return "flat_10_discount", 10
        else:
            return None, 0

    def calculate_total(self, discount_amount, gift_wrap_fee, shipping_fee):
        return self.calculate_subtotal() - discount_amount + gift_wrap_fee + shipping_fee

    def display_receipt(self):
        print("Product Name | Quantity | Total Amount")
        print("---------------------------------------")
        for product in self.products.values():
            print(f"{product.name} | {product.quantity} | ${product.calculate_total_price()}")
        
        subtotal = self.calculate_subtotal()
        discount_name, discount_amount = self.apply_discount()
        gift_wrap_fee = sum(product.quantity for product in self.products.values())  # $1 per unit
        shipping_fee = (subtotal // 10) * 5  # 10 units per package, $5 per package
        
        print("\nSubtotal:", f"${subtotal}")
        print("Discount Applied:", f"{discount_name} - ${discount_amount}")
        print("Gift Wrap Fee:", f"${gift_wrap_fee}")
        print("Shipping Fee:", f"${shipping_fee}")
        print("\nTotal:", f"${self.calculate_total(discount_amount, gift_wrap_fee, shipping_fee)}")


def main():
    cart = ShoppingCart()

    for product_name in cart.products:
        quantity = int(input(f"Enter the quantity of {product_name}: "))
        cart.products[product_name].quantity = quantity

        gift_wrap = input(f"Is {product_name} wrapped as a gift? (yes/no): ").lower()
        if gift_wrap == "yes":
            cart.products[product_name].quantity += quantity 

    cart.display_receipt()


if __name__ == "__main__":
    main()
