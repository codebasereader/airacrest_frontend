/**
 * Placeholder blog data for the public UI until the blogs API is live.
 * Remove or gate behind a feature flag once GET /blogs is available.
 */
export const DUMMY_BLOGS = [
  {
    _id: "dummy-blog-001",
    title: "Why Dehydrated Onion Is a Staple for Global Food Manufacturers",
    slug: "dehydrated-onion-global-food-manufacturers",
    excerpt:
      "From ready meals to seasoning blends, dehydrated white onion delivers consistent flavour, long shelf life, and export-ready quality — here's what buyers should know.",
    content: `
      <p>Dehydrated onion has become one of the most reliable ingredients in commercial kitchens and food manufacturing plants worldwide. Unlike fresh produce, which fluctuates in quality and availability across seasons, dehydrated white onion offers <strong>uniform particle size</strong>, <strong>stable moisture content</strong>, and a shelf life measured in months rather than days.</p>
      <h2>Key advantages for export buyers</h2>
      <ul>
        <li>Reduced freight weight compared to fresh or frozen alternatives</li>
        <li>No cold-chain dependency — ideal for markets with limited refrigeration infrastructure</li>
        <li>Consistent flavour profile batch after batch</li>
        <li>Available in kibbled, minced, granules, and powder grades</li>
      </ul>
      <p>At Aira Crest, our dehydration process preserves the natural pungency and colour of Gujarat-grown onions while meeting international food-safety standards. Whether you are formulating soups, sauces, or spice blends, the right grade of dehydrated onion can significantly simplify your supply chain.</p>
      <h2>What to look for in a supplier</h2>
      <p>When evaluating suppliers, request certificates of analysis (COA), moisture specifications, and microbiological test reports. A reputable exporter will also provide samples matched to your intended application — kibbled for visual texture, powder for seamless blending.</p>
    `.trim(),
    coverImage: {
      key: "",
      url: "/products/onion/onion1.webp",
    },
    product: null,
    author: "Aira Crest Team",
    tags: ["Dehydrated Vegetables", "Export", "Onion"],
    status: "published",
    publishedAt: "2025-11-12T08:00:00.000Z",
    createdAt: "2025-11-10T10:00:00.000Z",
    updatedAt: "2025-11-12T08:00:00.000Z",
  },
  {
    _id: "dummy-blog-002",
    title: "Turmeric Powder: Sourcing Curcumin-Rich Varieties from India",
    slug: "turmeric-powder-sourcing-india",
    excerpt:
      "India produces over 75% of the world's turmeric. Learn how to identify high-curcumin varieties, understand colour specifications, and partner with the right export house.",
    content: `
      <p>Indian turmeric — particularly from the Erode, Sangli, and Nizamabad belts — is prized globally for its <strong>deep golden colour</strong> and <strong>curcumin content</strong>. For food, beverage, and nutraceutical applications, understanding grade specifications is essential before placing bulk orders.</p>
      <h2>Grades and specifications</h2>
      <p>Export-grade turmeric powder is typically classified by curcumin percentage, mesh size, and moisture content. Common specifications include:</p>
      <ul>
        <li>Curcumin: 2% – 5% (application-dependent)</li>
        <li>Moisture: ≤ 10%</li>
        <li>Mesh: 60–80 for food; finer grades for supplements</li>
      </ul>
      <h2>Quality assurance</h2>
      <p>Reputable exporters conduct testing for lead, pesticide residues, and microbial load in accredited laboratories. Always request a pre-shipment sample and retain batch COAs for your own quality records.</p>
      <p>Aira Crest works directly with farmer clusters in Maharashtra and Andhra Pradesh, ensuring traceability from farm gate to export container. Our turmeric is sun-dried and ground in HACCP-certified facilities, ready for markets across the Middle East, Europe, and Southeast Asia.</p>
    `.trim(),
    coverImage: {
      key: "",
      url: "/products/turmeric/turmeric1.webp",
    },
    product: null,
    author: "Aira Crest Team",
    tags: ["Spices", "Turmeric", "Export"],
    status: "published",
    publishedAt: "2025-12-03T09:30:00.000Z",
    createdAt: "2025-12-01T14:00:00.000Z",
    updatedAt: "2025-12-03T09:30:00.000Z",
  },
];

export const getDummyBlogBySlug = (slug) =>
  DUMMY_BLOGS.find((blog) => blog.slug === slug) ?? null;

export const getDummyBlogsByProduct = (productId) =>
  DUMMY_BLOGS.filter((blog) => {
    const blogProductId =
      blog.product?._id || blog.product || null;
    return blogProductId && blogProductId === productId;
  });
