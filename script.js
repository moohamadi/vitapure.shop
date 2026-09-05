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

        // Cart Logic
        let cartCount = 0;
        const cartBadge = document.getElementById('cart-count');
        
        function addToCart() {
            cartCount++;
            cartBadge.innerText = cartCount;
            cartBadge.classList.remove('opacity-0');
            cartBadge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 200);
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

        // نمایش محتوای سبد خرید (فعلاً همیشه خالی، بعداً به localStorage وصل می‌شود)
        function renderCart() {
            const cart = []; // TODO: از localStorage خوانده خواهد شد
            const emptyState = document.getElementById('cart-empty-state');
            const itemsList = document.getElementById('cart-items-list');
            const footer = document.getElementById('cart-footer');

            if (cart.length === 0) {
                emptyState.classList.remove('hidden');
                itemsList.classList.add('hidden');
                footer.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                itemsList.classList.remove('hidden');
                footer.classList.remove('hidden');
            }
        }

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
    
