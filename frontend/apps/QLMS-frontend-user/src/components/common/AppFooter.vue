<template>
    <footer class="app-footer">
        <div class="footer-top">
            <div class="container footer-content">
                <!-- Cột trái: Logo + Tagline -->
                <div class="footer-left">
                    <div class="footer-logo">
                        <div class="tv-badge">TV</div>
                        <span class="site-name">Thư Viện</span>
                    </div>
                    <p class="tagline">Nơi tri thức được chia sẻ và lan tỏa</p>
                </div>

                <!-- Cột phải: Liên kết + Icon MXH -->
                <div class="footer-right">
                    <div class="quick-links">
                        <h4 class="links-title">Liên kết nhanh</h4>
                        <ul class="links-list">
                            <li><a href="#">Trang chủ</a></li>
                            <li><a href="#">Tất cả sách</a></li>
                            <li><a href="#">Theo dõi chúng tôi</a></li>
                        </ul>
                    </div>

                    <div class="social-icons">
                        <a href="#" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dòng copyright -->
        <div class="footer-bottom">
            <div class="container">
                <p>© 2025 Thư Viện. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
// Footer tĩnh, không cần logic
</script>

<style scoped>
.app-footer {
    background: #1e293b;
    color: #cbd5e1;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

/* Phần trên */
.footer-top {
    padding: 3rem 0 2rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4rem;
}

/* Logo + Tagline */
.footer-left {
    flex: 1;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 1rem;
}

.tv-badge {
    background: white;
    color: black;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.4rem;
    /* box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); */
}

.site-name {
    font-size: 1.6rem;
    font-weight: 800;
    color: white;
}

.tagline {
    font-size: 0.95rem;
    color: #94a3b8;
    margin: 0;
    line-height: 1.5;
}

/* Liên kết + Icon */
.footer-right {
    display: flex;
    align-items: flex-start;
    gap: 4rem;
}

.links-title {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
}

.links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.links-list a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
}

.links-list a:hover {
    /* color: #a855f7; */
}

.social-icons {
    display: flex;
    gap: 1rem;
}

.social-icons a {
    color: #94a3b8;
    font-size: 1.1rem;
    transition: all 0.2s;
}

.social-icons a:hover {
    color: #a855f7;
    transform: translateY(-3px);
}

/* Dòng copyright */
.footer-bottom {
    border-top: 1px solid #1e293b;
    padding: 1.5rem 0;
    text-align: center;
}

.footer-bottom p {
    margin: 0;
    font-size: 0.875rem;
    color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        gap: 2.5rem;
        text-align: center;
    }

    .footer-right {
        justify-content: center;
        gap: 3rem;
    }

    .footer-logo {
        justify-content: center;
    }
}
</style>