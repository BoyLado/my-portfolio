const nav = document.getElementById('main-nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { nav.classList.add('scrolled'); } 
            else { nav.classList.remove('scrolled'); }
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('reveal'); }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal, .skill-category').forEach(el => revealObserver.observe(el));

        window.addEventListener('DOMContentLoaded', () => {
            const heroReveals = [
                document.querySelector('.hero-label'),
                document.querySelector('.hero h1'),
                document.querySelector('.hero-subtext'),
                document.querySelector('.hero-actions')
            ];
            heroReveals.forEach((el, i) => {
                setTimeout(() => { if(el) el.classList.add('faded'); }, 200 * (i + 1));
            });
        });

        function updateClock() {
            const now = new Date();
            const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' };
            const clockEl = document.getElementById('clock');
            if(clockEl) clockEl.innerText = `LOCAL_TIME // ${now.toLocaleTimeString('en-US', options)} PHT`;
        }
        setInterval(updateClock, 1000); updateClock();

        const trigger = document.getElementById('mobile-trigger');
        const overlay = document.getElementById('mobile-overlay');
        function toggleMenu() {
            trigger.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : 'auto';
        }
        if(trigger) trigger.addEventListener('click', toggleMenu);
        
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                trigger.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        const canvas = document.getElementById("bg-canvas");
        const ctx = canvas.getContext("2d");
        let width, height, particles = [];
        const particleColor = "rgba(180, 180, 180, 0.5)";
        const linkColor = "100, 100, 100";
        const activeLinkColor = "45, 90, 39";
        const particleCount = window.innerWidth < 768 ? 40 : 90;
        const connectionDistance = 150;
        const mouseDistance = 200;
        let mouse = { x: null, y: null };

        window.addEventListener("mousemove", (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, index) => {
                p.update(); p.draw();
                for (let j = index; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x; const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = `rgba(${linkColor}, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
                if (mouse.x != null) {
                    const dx = p.x - mouse.x; const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        ctx.beginPath();
                        const opacity = 1 - distance / mouseDistance;
                        ctx.strokeStyle = `rgba(${activeLinkColor}, ${opacity * 0.6})`;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", () => { resize(); initParticles(); });
        resize(); initParticles(); animate();