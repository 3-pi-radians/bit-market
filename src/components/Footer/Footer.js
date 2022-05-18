const Footer = () => {
    const colClass = "text-[#DDD] text-sm space-y-4";
    const smallLinkClass = "cursor-pointer";
    return (
        <div className="bg-[#131A22]  bottom-0 left-0 w-[100%] grid gap-y-10 px-32 py-14 grid-cols-1 md:grid-cols-4 ">
            <div className={colClass}>
                <h2 className="font-bold cursor-pointer">About</h2>
                <p className={smallLinkClass}>How we work</p>
                <p className={smallLinkClass}>News Room</p>
                <p className={smallLinkClass}>Investors</p>
                <p className={smallLinkClass}>Roadmap</p>
            </div>
            <div className={colClass}>
                <h2 className="font-bold cursor-pointer">Contact</h2>
                <p className={smallLinkClass}>Our Mail</p>
                <p className={smallLinkClass}>Our Contact</p>
                <p className={smallLinkClass}>Availability</p>
                <p className={smallLinkClass}>Find Some Help</p>
            </div>
            <div className={colClass}>
                <h2 className="font-bold cursor-pointer">Community</h2>
                <p className={smallLinkClass}>Accessibility</p>
                <p className={smallLinkClass}>Our People</p>
                <p className={smallLinkClass}>Our Locations</p>
                <p className={smallLinkClass}>Our Goal</p>
            </div>
            <div className={colClass}>
                <h2 className="font-bold cursor-pointer">Policy</h2>
                <p className={smallLinkClass}>Privacy Policy</p>
                <p className={smallLinkClass}>Seller Policy</p>
                <p className={smallLinkClass}>Customer Policy</p>
                <p className={smallLinkClass}>Join Now</p>
            </div>
        </div>
    );
}

export default Footer;