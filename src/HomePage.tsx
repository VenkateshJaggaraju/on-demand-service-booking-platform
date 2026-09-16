import React, { useState } from "react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { isCustomerLoggedIn, isServiceProviderLoggedIn } from "./utils/Auth"; // adjust path to match your project

interface Service {
    id: number;
    name: string;
    description: string;
    price: string;
    icon: string;
    color: string;
}

interface Step {
    id: number;
    title: string;
    description: string;
    icon: string;
}

interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string;
}

const services: Service[] = [
    {
        id: 1,
        name: "Home Cleaning",
        description: "Professional home cleaning service",
        price: "₹499",
        icon: "🧹",
        color: "service-blue",
    },
    {
        id: 2,
        name: "Plumbing",
        description: "Expert plumbing at your doorstep",
        price: "₹299",
        icon: "🔧",
        color: "service-cyan",
    },
    {
        id: 3,
        name: "Electrical",
        description: "Safe and reliable electrical work",
        price: "₹249",
        icon: "⚡",
        color: "service-yellow",
    },
    {
        id: 4,
        name: "AC Service",
        description: "AC repair, service and installation",
        price: "₹399",
        icon: "❄️",
        color: "service-sky",
    },
    {
        id: 5,
        name: "Painting",
        description: "Professional painting services",
        price: "₹999",
        icon: "🎨",
        color: "service-pink",
    },
    {
        id: 6,
        name: "Appliance Repair",
        description: "Repair all major home appliances",
        price: "₹349",
        icon: "🔌",
        color: "service-purple",
    },
    {
        id: 7,
        name: "Carpentry",
        description: "Furniture and carpentry services",
        price: "₹299",
        icon: "🪚",
        color: "service-orange",
    },
    {
        id: 8,
        name: "More Services",
        description: "Explore all our services",
        price: "",
        icon: "•••",
        color: "service-green",
    },
];

const steps: Step[] = [
    {
        id: 1,
        title: "Search Service",
        description: "Find and choose the service you need.",
        icon: "⌕",
    },
    {
        id: 2,
        title: "Book & Schedule",
        description: "Select your preferred date and time.",
        icon: "▣",
    },
    {
        id: 3,
        title: "Professional Arrives",
        description: "Our verified professional arrives on time.",
        icon: "♙",
    },
    {
        id: 4,
        title: "Service Completed",
        description: "Get your service completed with satisfaction.",
        icon: "✓",
    },
];

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        location: "Bengaluru",
        rating: 5,
        comment:
        "The booking process was very easy. The electrician arrived on time and fixed everything perfectly.",
        avatar: "RS",
    },
    {
        id: 2,
        name: "Priya Reddy",
        location: "Hyderabad",
        rating: 5,
        comment:
        "Excellent cleaning service. The professional was very polite and did a great job.",
        avatar: "PR",
    },
    {
        id: 3,
        name: "Arjun Kumar",
        location: "Chennai",
        rating: 4,
        comment:
        "Very convenient platform. I found a plumber within minutes and the pricing was transparent.",
        avatar: "AK",
    },
    ];

    const ArrowRightIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
    </svg>
);

const SearchIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
        />
    </svg>
);

const LocationIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21s7-5.5 7-12a7 7 0 10-14 0c0 6.5 7 12 7 12z"
        />
        <circle cx="12" cy="9" r="2.5" />
    </svg>
);

const CheckIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
        />
    </svg>
);

const MenuIcon = () => (
    <svg
        className="icon menu-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
        />
    </svg>
);

const CloseIcon = () => (
    <svg
        className="icon menu-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 6l12 12M18 6L6 18"
        />
    </svg>
);

export const HomePage: React.FC = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [location, setLocation] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        console.log("Location:", location);
        console.log("Service:", serviceSearch);
    };

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
    );

    // Decides where "Explore" / "Book Now" should go, based on whether the
    // customer already has a valid token.
    const handleServiceClick = async (service: Service) => {
        const loggedIn = await isCustomerLoggedIn();

        if (service.id === 8) {
        if (loggedIn) {
            navigate("/services");
        } else {
            navigate("/customer/login", { state: { redirectTo: "/services" } });
        }
        return;
        }

        if (loggedIn) {
        navigate("/payment", { state: { serviceId: service.id } });
        } else {
        navigate("/customer/login", {
            state: { redirectTo: "/payment", serviceId: service.id },
        });
        }
    };

    // Same pattern for the provider flow: check the token before deciding
    // whether to send them to login or straight to the provider dashboard.
    // Fixes: "Become a Provider" always redirected to login even after a
    // successful service-provider login, because the link never checked
    // auth state at all — it just hard-navigated to /service-provider/login.
    const handleBecomeProviderClick = async () => {
        const loggedIn = await isServiceProviderLoggedIn();

        if (loggedIn) {
        navigate("/service-provider/provide-services");
        } else {
        navigate("/service-provider/login", {
            state: { redirectTo: "/service-provider/provide-services" },
        });
        }
    };

    return (
        <div className="home-page">
        {/* NAVBAR */}
        <header className="navbar">
            <div className="container navbar-inner">
            <a href="#" className="logo">
                <div className="logo-icon">⌂</div>

                <div>
                <h1>
                    Home<span>Serve</span>
                </h1>
                <p>Services at your doorstep</p>
                </div>
            </a>

            <nav className="desktop-nav">
                <a href="#home" className="active">
                Home
                </a>
                <Link to="/services">Services</Link>
                <Link to="">How It Works</Link>
                <a
                href="#provider"
                onClick={(e) => {
                    e.preventDefault();
                    handleBecomeProviderClick();
                }}
                >
                Become a Provider
                </a>
                <Link to="">About Us</Link>
            </nav>

            <div className="auth-buttons">
                <Link to="/customer/login">
                <button className="btn btn-outline">Login</button>
                </Link>
                <Link to="/customer/register">
                <button className="btn btn-primary">Sign Up</button>
                </Link>
            </div>

            <button
                className="mobile-menu-button"
                onClick={() => setMobileMenu(!mobileMenu)}
            >
                {mobileMenu ? <CloseIcon /> : <MenuIcon />}
            </button>
            </div>

            {mobileMenu && (
            <div className="mobile-nav">
                <a href="#home" onClick={() => setMobileMenu(false)}>
                Home
                </a>
                <a href="#services" onClick={() => setMobileMenu(false)}>
                Services
                </a>
                <a href="#how-it-works" onClick={() => setMobileMenu(false)}>
                How It Works
                </a>
                <a
                href="#provider"
                onClick={(e) => {
                    e.preventDefault();
                    setMobileMenu(false);
                    handleBecomeProviderClick();
                }}
                >
                Become a Provider
                </a>

                <div className="mobile-auth">
                <Link to="/customer/login">
                    <button className="btn btn-outline">Login</button>
                </Link>
                <Link to="/customer/register">
                    <button className="btn btn-primary">Sign Up</button>
                </Link>
                </div>
            </div>
            )}
        </header>

        {/* HERO */}
        <main>
            <section id="home" className="hero">
            <div className="hero-decoration hero-decoration-one" />
            <div className="hero-decoration hero-decoration-two" />

            <div className="container hero-grid">
                <div className="hero-content">
                <div className="trust-badge">
                    <span />
                    Trusted by 10,000+ customers
                </div>

                <h2>
                    Reliable Home Services
                    <span>At Your Doorstep</span>
                </h2>

                <p className="hero-description">
                    Book trusted professionals for all your home needs. Quick,
                    reliable and hassle-free services whenever you need them.
                </p>

                <div className="search-box">
                    <div className="search-field location-field">
                    <LocationIcon />

                    <div>
                        <label>LOCATION</label>
                        <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your location"
                        />
                    </div>
                    </div>

                    <div className="search-field">
                    <SearchIcon />

                    <div>
                        <label>SERVICE</label>
                        <input
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search for services..."
                        />
                    </div>
                    </div>

                    <button className="search-button" onClick={handleSearch}>
                    <SearchIcon />
                    Search
                    </button>
                </div>

                <div className="trust-features">
                    <div>
                    <span>
                        <CheckIcon />
                    </span>
                    Verified Professionals
                    </div>

                    <div>
                    <span>₹</span>
                    Transparent Pricing
                    </div>

                    <div>
                    <span>◷</span>
                    On-time Service
                    </div>
                </div>
                </div>

                <div className="hero-visual">
                <div className="hero-illustration">
                    <div className="hero-circle" />

                    <div className="person">
                    <div className="person-head" />
                    <div className="person-hair" />
                    <div className="person-body">
                        <div className="person-logo" />
                    </div>

                    <div className="tool">🔧</div>
                    </div>
                </div>

                <div className="floating-card card-one">
                    <div className="floating-icon">✓</div>
                    <div>
                    <strong>10,000+</strong>
                    <small>Happy Customers</small>
                    </div>
                </div>

                <div className="floating-card card-two">
                    <div className="rating-icon">⭐</div>
                    <div>
                    <strong>4.8/5</strong>
                    <small>Customer Rating</small>
                    </div>
                </div>

                <div className="floating-card card-three">
                    <div className="floating-icon success">✓</div>
                    <div>
                    <strong>Quick & Easy</strong>
                    <small>Booking</small>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* SERVICES */}
            <section id="services" className="section services-section">
            <div className="container">
                <div className="section-heading">
                <p>OUR SERVICES</p>
                <h2>Popular Home Services</h2>
                <span>
                    Choose from our wide range of professional home services
                    delivered by trusted experts.
                </span>
                </div>

                <div className="services-grid">
                {filteredServices.map((service) => (
                    <div className="service-card" key={service.id}>
                    <div className={`service-icon ${service.color}`}>
                        {service.icon}
                    </div>

                    <h3>{service.name}</h3>

                    <p>{service.description}</p>

                    {service.price && (
                        <div className="service-price">
                        Starting from <strong>{service.price}</strong>
                        </div>
                    )}

                    <button
                        className="book-button"
                        onClick={() => handleServiceClick(service)}
                    >
                        {service.id === 8 ? "Explore" : "Book Now"}
                        <ArrowRightIcon />
                    </button>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* STATS */}
            <section className="stats">
            <div className="container stats-grid">
                <div>
                <strong>10K+</strong>
                <span>Happy Customers</span>
                </div>

                <div>
                <strong>2K+</strong>
                <span>Professionals</span>
                </div>

                <div>
                <strong>50K+</strong>
                <span>Services Completed</span>
                </div>

                <div>
                <strong>4.8/5</strong>
                <span>Average Rating</span>
                </div>
            </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="section">
            <div className="container">
                <div className="section-heading">
                <p>HOW IT WORKS</p>
                <h2>Book a service in 4 simple steps</h2>
                <span>
                    Getting professional help for your home has never been easier.
                </span>
                </div>

                <div className="steps-grid">
                {steps.map((step, index) => (
                    <div className="step" key={step.id}>
                    {index < steps.length - 1 && (
                        <div className="step-connector" />
                    )}

                    <div className="step-icon">
                        {step.icon}
                        <span>{step.id}</span>
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* PROVIDER */}
            <section id="provider" className="section provider-section">
            <div className="container">
                <div className="provider-card">
                <div className="provider-content">
                    <p>FOR PROFESSIONALS</p>

                    <h2>Grow your business with HomeServe</h2>

                    <span>
                    Join thousands of professionals, get more customers, manage
                    your bookings and grow your income.
                    </span>

                    <div className="provider-features">
                    <div>
                        <CheckIcon />
                        Get more customers
                    </div>
                    <div>
                        <CheckIcon />
                        Manage your bookings easily
                    </div>
                    <div>
                        <CheckIcon />
                        Track your earnings
                    </div>
                    </div>

                    <button
                    className="provider-button"
                    onClick={handleBecomeProviderClick}
                    >
                    Become a Provider
                    <ArrowRightIcon />
                    </button>
                </div>

                <div className="provider-visual">
                    <div className="provider-avatar">👨‍🔧</div>
                    <h3>2,000+ Professionals</h3>
                    <p>are already growing with us</p>
                </div>
                </div>
            </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="about" className="section testimonials-section">
            <div className="container">
                <div className="section-heading">
                <p>CUSTOMER REVIEWS</p>
                <h2>What our customers say</h2>
                </div>

                <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                    <div className="testimonial-card" key={testimonial.id}>
                    <div className="stars">{"★".repeat(testimonial.rating)}</div>

                    <p>"{testimonial.comment}"</p>

                    <div className="testimonial-user">
                        <div className="avatar">{testimonial.avatar}</div>

                        <div>
                        <strong>{testimonial.name}</strong>
                        <span>{testimonial.location}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* FINAL CTA */}
            <section className="final-cta">
            <div className="container">
                <h2>Need a service at your doorstep?</h2>

                <p>
                Find trusted professionals near you and book your service in just
                a few clicks.
                </p>

                <button>
                Book a Service
                <ArrowRightIcon />
                </button>
            </div>
            </section>
        </main>

        {/* FOOTER */}
        <footer className="footer">
            <div className="container footer-grid">
            <div>
                <div className="footer-logo">
                <div>⌂</div>
                <span>
                    Home<span>Serve</span>
                </span>
                </div>

                <p>
                Professional home services delivered by trusted experts right at
                your doorstep.
                </p>
            </div>

            <div>
                <h3>Company</h3>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
                <a href="#">Careers</a>
                <a href="#">Blog</a>
            </div>

            <div>
                <h3>Services</h3>
                <a href="#">Home Cleaning</a>
                <a href="#">Plumbing</a>
                <a href="#">Electrical</a>
                <a href="#">AC Service</a>
            </div>

            <div>
                <h3>Support</h3>
                <a href="#">Help Center</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Conditions</a>
                <a href="#">Cancellation Policy</a>
            </div>
            </div>

            <div className="footer-bottom">
            <div className="container">
                <span>© 2026 HomeServe. All rights reserved.</span>
                <span>Made for better homes.</span>
            </div>
            </div>
        </footer>
        </div>
    );
};
