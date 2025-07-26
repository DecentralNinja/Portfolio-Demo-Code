import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState, useRef } from "react";
import gsap from "gsap";
import { useLocation, useNavigate } from "react-router-dom";

const NavCircle = forwardRef(({ onRouteChange }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navContainerRef = useRef(null);
  const rotatingElementRef = useRef(null);
  const indicatorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Navigation items with their positions
  const navItems = [
    { 
      path: "/", 
      label: "HOME", 
      angle: -60,
      position: { x: 0, y: -70 }
    },
    { 
      path: "/work", 
      label: "WORK", 
      angle: 0,
      position: { x: 70, y: 0 }
    },
    { 
      path: "/about", 
      label: "ABOUT", 
      angle: 60,
      position: { x: 0, y: 70 }
    }
  ];

  // Get current navigation item
  const getCurrentNavItem = () => {
    return navItems.find(item => item.path === location.pathname) || navItems[0];
  };

  // Initialize component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate in from bottom
      gsap.fromTo(navContainerRef.current, {
        y: 100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5
      });

      // Set initial rotation
      const currentItem = getCurrentNavItem();
      gsap.set(rotatingElementRef.current, {
        rotation: currentItem.angle
      });

    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update indicator position when location changes
  useEffect(() => {
    if (!isVisible || isAnimating) return;

    const currentItem = getCurrentNavItem();
    updateIndicatorPosition(currentItem);
  }, [location.pathname, isVisible]);

  const updateIndicatorPosition = (navItem) => {
    gsap.to(rotatingElementRef.current, {
      rotation: navItem.angle,
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.to(indicatorRef.current, {
      x: navItem.position.x,
      y: navItem.position.y,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const handleNavigation = (targetPath) => {
    if (targetPath === location.pathname || isAnimating) return;

    setIsAnimating(true);
    const targetItem = navItems.find(item => item.path === targetPath);
    
    // Trigger route change with animation
    if (onRouteChange) {
      onRouteChange(targetPath);
    }

    // Animate rotation during transition
    gsap.to(rotatingElementRef.current, {
      rotation: `+=${360}`,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: function() {
        // Update indicator at halfway point
        if (this.progress() > 0.5 && this.progress() < 0.6) {
          updateIndicatorPosition(targetItem);
        }
      },
      onComplete: () => {
        setIsAnimating(false);
      }
    });
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    triggerPageTransition: (targetRoute) => {
      handleNavigation(targetRoute);
    }
  }));

  if (!isVisible) return null;

  return (
    <div className="nav-circle-container fixed bottom-0 left-0 w-full pointer-events-none z-50">
      <div 
        ref={navContainerRef}
        className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 pointer-events-auto"
      >
        {/* Main Navigation Circle */}
        <div className="relative w-40 h-40">
          {/* Navigation Dot */}
          <div className="menu__dot absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10"></div>
          
          {/* Rotating Navigation Elements */}
          <div ref={rotatingElementRef} className="absolute inset-0">
            {navItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="absolute w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full transition-all duration-300 cursor-pointer border border-white/30"
                style={{
                  top: `calc(50% + ${item.position.y}px)`,
                  left: `calc(50% + ${item.position.x}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="sr-only">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Active Indicator */}
          <div 
            ref={indicatorRef}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Outer Circle Border */}
          <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />
        </div>

        {/* Navigation Labels */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4">
          <div className="text-white text-sm font-medium opacity-70">
            {getCurrentNavItem().label}
          </div>
        </div>
      </div>
    </div>
  );
});

NavCircle.displayName = 'NavCircle';

export default NavCircle;
