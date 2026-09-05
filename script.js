// تنظیمات سفارشی Tailwind
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Vazirmatn', 'sans-serif'] },
                    colors: {
                        brand: { light: '#E6F4F1', DEFAULT: '#7CB9A8', dark: '#4A8B7C', accent: '#D4AF37' }
                    }
                }
            }
        }
    

        // Navbar Glass Effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    navbar.classList.add('glass-nav', 'shadow-sm');
                    navbar.classList.remove('py-4');
                    navbar.classList.add('py-2');
                } else {
                    navbar.classList.remove('glass-nav', 'shadow-sm');
                    navbar.classList.remove('py-2');
                    navbar.classList.add('py-4');
                }
            });
        }

        // ==================== منطق سبد خرید (localStorage) ====================
        const CART_KEY = 'vitapure_cart';
        const cartBadge = document.getElementById('cart-count');

        // تبدیل اعداد فارسی به انگلیسی
        function toEnglishDigits(str) {
            const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
            return str.replace(/[۰-۹]/g, d => persian.indexOf(d));
        }

        // استخراج عدد قیمت از متنی مثل «۸۷,۵۰۰ تومان»
        function parsePrice(text) {
            const englishText = toEnglishDigits(text);
            const digitsOnly = englishText.replace(/[^\d]/g, '');
            return parseInt(digitsOnly, 10) || 0;
        }

        // نمایش عدد به‌صورت فارسی با جداکننده هزارگان
        function formatPriceFa(num) {
            const withCommas = num.toLocaleString('en-US');
            return toPersianDigits(withCommas);
        }

        function toPersianDigits(str) {
            const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
            return String(str).replace(/[0-9]/g, d => persian[d]);
        }

        function getCart() {
            try {
                return JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch (e) {
                return [];
            }
        }

        function saveCart(cart) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            updateCartBadge();
        }

        function updateCartBadge() {
            if (!cartBadge) return;
            const cart = getCart();
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            cartBadge.innerText = totalQty;
            if (totalQty > 0) {
                cartBadge.classList.remove('opacity-0');
            } else {
                cartBadge.classList.add('opacity-0');
            }
        }

        // افزودن محصول به سبد خرید (فراخوانی از دکمه «خرید» روی هر کارت)
        function addToCart(btn) {
            const card = btn.closest('.product-card');
            if (!card) return;

            const name = card.querySelector('h3').innerText.trim();
            const priceText = card.querySelector('.p-5 .font-bold.text-lg').innerText.trim();
            const price = parsePrice(priceText);
            const image = card.querySelector('.product-image').getAttribute('src');

            let cart = getCart();
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, image, qty: 1 });
            }
            saveCart(cart);

            // افکت کوچک روی نشان سبد خرید
            if (cartBadge) {
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
            }

            // بازخورد کوتاه روی خود دکمه
            const span = btn.querySelector('span');
            if (span) {
                const original = span.innerText;
                span.innerText = '✓ افزوده شد';
                setTimeout(() => { span.innerText = original; }, 1200);
            }
        }

        function changeQty(name, delta) {
            let cart = getCart();
            const item = cart.find(i => i.name === name);
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
            saveCart(cart);
            renderCart();
        }

        function removeFromCart(name) {
            let cart = getCart().filter(i => i.name !== name);
            saveCart(cart);
            renderCart();
        }

        // باز/بسته کردن مودال سبد خرید
        function openCartModal() {
            document.getElementById('cart-overlay').classList.remove('hidden');
            const modal = document.getElementById('cart-modal');
            modal.classList.remove('translate-x-[-100%]');
            document.body.style.overflow = 'hidden';
            renderCart();
        }

        function closeCartModal() {
            document.getElementById('cart-overlay').classList.add('hidden');
            document.getElementById('cart-modal').classList.add('translate-x-[-100%]');
            document.body.style.overflow = '';
        }

        // ساخت HTML یک ردیف محصول در مودال سبد خرید
        function cartItemTemplate(item) {
            const safeName = item.name.replace(/'/g, "\\'");
            return `
                <div class="flex items-center gap-4 py-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain bg-gray-50 rounded-xl flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-gray-900 truncate">${item.name}</h4>
                        <p class="text-xs text-gray-400 mt-1">${formatPriceFa(item.price)} تومان</p>
                        <div class="flex items-center gap-3 mt-2">
                            <button onclick="changeQty('${safeName}', -1)" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">−</button>
                            <span class="text-sm font-medium w-4 text-center">${toPersianDigits(item.qty)}</span>
                            <button onclick="changeQty('${safeName}', 1)" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart('${safeName}')" class="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>`;
        }

        // نمایش محتوای سبد خرید
        function renderCart() {
            const cart = getCart();
            const emptyState = document.getElementById('cart-empty-state');
            const itemsList = document.getElementById('cart-items-list');
            const footer = document.getElementById('cart-footer');

            if (cart.length === 0) {
                emptyState.classList.remove('hidden');
                itemsList.classList.add('hidden');
                footer.classList.add('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            itemsList.classList.remove('hidden');
            footer.classList.remove('hidden');

            itemsList.innerHTML = cart.map(cartItemTemplate).join('');

            const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            document.getElementById('cart-total').innerText = formatPriceFa(total) + ' تومان';
        }
        // ==================== پایان منطق سبد خرید ====================

        // نمایش تعداد سبد خرید هنگام بارگذاری اولیه صفحه (اگر قبلاً چیزی ذخیره شده)
        document.addEventListener('DOMContentLoaded', updateCartBadge);

        // ==================== منطق صفحه تسویه‌حساب (checkout.html) ====================

        function renderCheckoutSummary() {
            const summaryEl = document.getElementById('checkout-summary');
            const totalEl = document.getElementById('checkout-total');
            const emptyMsg = document.getElementById('checkout-empty');
            const formSection = document.getElementById('checkout-form-section');
            if (!summaryEl) return; // فقط روی صفحه checkout اجرا شود

            const cart = getCart();

            if (cart.length === 0) {
                emptyMsg.classList.remove('hidden');
                formSection.classList.add('hidden');
                summaryEl.innerHTML = '';
                totalEl.innerText = '';
                return;
            }

            emptyMsg.classList.add('hidden');
            formSection.classList.remove('hidden');

            summaryEl.innerHTML = cart.map(item => `
                <div class="flex items-center gap-3 py-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain bg-gray-50 rounded-lg flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">${item.name}</p>
                        <p class="text-xs text-gray-400">تعداد: ${toPersianDigits(item.qty)}</p>
                    </div>
                    <span class="text-sm font-bold text-gray-900 flex-shrink-0">${formatPriceFa(item.price * item.qty)} تومان</span>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            totalEl.innerText = formatPriceFa(total) + ' تومان';
        }

        function generateOrderCode() {
            const num = Math.floor(100000 + Math.random() * 899999);
            return 'VP-' + toPersianDigits(num);
        }

        function submitOrder(event) {
            event.preventDefault();

            const name = document.getElementById('checkout-name').value.trim();
            const phone = document.getElementById('checkout-phone').value.trim();
            const address = document.getElementById('checkout-address').value.trim();

            if (name.length < 3) {
                alert('لطفاً نام و نام‌خانوادگی معتبر وارد کنید.');
                return;
            }
            if (!/^0\d{10}$/.test(toEnglishDigits(phone))) {
                alert('لطفاً شماره موبایل را به‌درستی وارد کنید (مثال: 09123456789).');
                return;
            }
            if (address.length < 10) {
                alert('لطفاً آدرس کامل‌تری وارد کنید.');
                return;
            }

            const cart = getCart();
            if (cart.length === 0) {
                alert('سبد خرید شما خالی است.');
                return;
            }

            const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            const orderCode = generateOrderCode();

            // نمایش صفحه تایید سفارش
            document.getElementById('checkout-order-code').innerText = orderCode;
            document.getElementById('checkout-order-total').innerText = formatPriceFa(total) + ' تومان';
            document.getElementById('checkout-main-view').classList.add('hidden');
            document.getElementById('checkout-success-view').classList.remove('hidden');

            // پاک کردن سبد خرید
            localStorage.removeItem(CART_KEY);
            updateCartBadge();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
        // ==================== پایان منطق صفحه تسویه‌حساب ====================



        // Slider Drag Functionality
        const sliders = document.querySelectorAll('.slider-container');
        sliders.forEach(slider => {
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.style.cursor = 'grabbing';
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });
        });

        // Slider Navigation Buttons
        const prevButtons = document.querySelectorAll('.slider-prev');
const nextButtons = document.querySelectorAll('.slider-next');

prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const sliderId = btn.dataset.slider;
        const slider = document.getElementById(`slider-${sliderId}`);
        const itemWidth = slider.querySelector('.slider-item').offsetWidth + 24;
        slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });
});

nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const sliderId = btn.dataset.slider;
        const slider = document.getElementById(`slider-${sliderId}`)
        const itemWidth = slider.querySelector('.slider-item').offsetWidth + 24;
        slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }); 
});


        // انیمیشن دودل روی هاور - فقط برای ۴ کارت پرفروش (بخش Best Sellers)
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof gsap === 'undefined') return;

            const bestsellerCards = document.querySelectorAll('.bestseller-card');

            bestsellerCards.forEach((card) => {
                const doodleContainer = card.querySelector('.doodle-container');
                const doodles = card.querySelectorAll('.doodle');
                const productImage = card.querySelector('.product-image');
                if (!doodleContainer || doodles.length === 0) return;

                card.addEventListener('mouseenter', () => {
                    gsap.to(doodleContainer, { opacity: 1, duration: 0.3 });
                    doodles.forEach((doodle, i) => {
                        gsap.to(doodle, {
                            opacity: 1,
                            scale: 1,
                            rotation: Math.random() * 30 - 15,
                            duration: 0.6,
                            delay: i * 0.08,
                            ease: 'back.out(1.7)',
                            onComplete: () => doodle.classList.add(`anim-doodle-${(i % 3) + 1}`)
                        });
                    });
                    if (productImage) gsap.to(productImage, { scale: 1.08, duration: 0.5 });
                });

                card.addEventListener('mouseleave', () => {
                    doodles.forEach(d => d.classList.remove('anim-doodle-1', 'anim-doodle-2', 'anim-doodle-3'));
                    gsap.to(doodleContainer, { opacity: 0, duration: 0.3 });
                    gsap.to(doodles, { opacity: 0, scale: 0.5, rotation: 0, duration: 0.3, stagger: 0.03 });
                    if (productImage) gsap.to(productImage, { scale: 1, duration: 0.5 });
                });
            });
        });

        // ارسال درخواست مشاوره
    function submitConsultation() {
    const text = document.getElementById('consultation-text').value;
    const minLength = 20;
    
    if (text.length < minLength) {
        alert('لطفاً حداقل ۲۰ کاراکتر وارد کنید.');
        return;
    }
    
    //* اینجا می‌تونی به API متصل کنی *//
    alert('✅ درخواست مشاوره شما با موفقیت ارسال شد!\n\nکارشناسان ما در کمتر از ۲۴ ساعت با شما تماس خواهند گرفت.');
    
    // پاک کردن فرم
    document.getElementById('consultation-text').value = '';
 }
    
