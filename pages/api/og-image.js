import { templates } from "../../app/PortfolioTemplates";

export default async function handler(req, res) {
	const { name } = req.query;

	if (!name) {
		return res.status(400).json({ error: "Template name is required" });
	}

	// Find the template
	const templateName = decodeURIComponent(name)
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase());

	const template = templates.find(
		(t) => t.name.toLowerCase() === templateName.toLowerCase()
	);

	if (!template) {
		return res.status(404).json({ error: "Template not found" });
	}

	// Truncate description if too long
	const maxDescriptionLength = 100;
	const truncatedDescription =
		template.description.length > maxDescriptionLength
			? template.description.substring(0, maxDescriptionLength) + "..."
			: template.description;

	// Create SVG
	const svg = `
    <svg width="100%" height="100%" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with gradient -->
      <rect width="100%" height="100%" fill="url(#backgroundGradient)"/>
      
      <!-- Decorative elements -->
      <circle cx="8.33%" cy="15.87%" r="6.67%" fill="url(#accentGradient)" opacity="0.1"/>
      <circle cx="91.67%" cy="84.13%" r="10%" fill="url(#accentGradient)" opacity="0.08"/>
      <rect x="83.33%" y="12.7%" width="16.67%" height="31.75%" rx="1.67%" fill="url(#accentGradient)" opacity="0.05"/>
      
      <!-- Main content container -->
      <g transform="translate(6.67%, 12.7%)">
        <!-- Header section -->
        <g>
          <!-- Template category badge -->
          <rect x="0" y="0" width="10%" height="5.71%" rx="2.86%" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.1)"/>
          <text x="1.33%" y="3.81%" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="2.22%" font-weight="600" fill="#374151">
            ${template.category}
          </text>
        </g>
        
        <!-- Template name -->
        <text x="0" y="12.7%" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="8.89%" font-weight="800" fill="#111827" letter-spacing="-0.02em">
          ${template.name}
        </text>
        
        <!-- Description -->
        <foreignObject x="0" y="19.05%" width="86.67%" height="19.05%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 4.44%; color: #6B7280; line-height: 1.5; font-weight: 400;">
            ${truncatedDescription}
          </div>
        </foreignObject>
        
        <!-- Code preview section -->
        <g transform="translate(0, 44.44%)">
          <!-- Preview container -->
          <rect width="86.67%" height="28.57%" rx="2.54%" fill="#1F2937" stroke="rgba(255,255,255,0.1)" stroke-width="0.08%"/>
          
          <!-- Code header -->
          <rect width="86.67%" height="6.35%" rx="2.54%" fill="#374151"/>
          <circle cx="1.67%" cy="3.17%" r="0.48%" fill="#EF4444"/>
          <circle cx="3.33%" cy="3.17%" r="0.48%" fill="#F59E0B"/>
          <circle cx="5%" cy="3.17%" r="0.48%" fill="#10B981"/>
          
          <!-- Code content -->
          <text x="1.67%" y="11.11%" font-family="'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace" font-size="2.54%" fill="#E5E7EB">
            <tspan x="1.67%" dy="0">import { ${template.name.replace(
							/\s+/g,
							""
						)} } from 'gettemplate'</tspan>
            <tspan x="1.67%" dy="4.76%">const template = new ${template.name.replace(
							/\s+/g,
							""
						)}()</tspan>
            <tspan x="1.67%" dy="4.76%">template.render()</tspan>
          </text>
        </g>
      </g>
      
      <!-- Bottom logo section -->
      <g transform="translate(50%, 92.06%)">
        <!-- Logo container -->
        <rect x="-10%" y="-2.38%" width="20%" height="4.76%" rx="2.38%" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.1)" stroke-width="0.08%"/>
        
        <!-- Logo text -->
        <text x="0" y="-0.63%" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="1.43%" font-weight="700" fill="#111827" text-anchor="middle">
          gettemplate
        </text>
        <text x="0" y="0.95%" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="0.95%" font-weight="500" fill="#6B7280" text-anchor="middle">
          .website
        </text>
      </g>
      
      <!-- Gradient definitions -->
      <defs>
        <linearGradient id="backgroundGradient" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="50%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
    </svg>
  `;

	// Set headers for SVG
	res.setHeader("Content-Type", "image/svg+xml");
	res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

	// Send the SVG
	res.status(200).send(svg);
}
