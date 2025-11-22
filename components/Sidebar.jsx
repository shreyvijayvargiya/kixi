import React from "react";

const Sidebar = ({ clients, companies, onSelectClient, onSelectCompany }) => {
	return (
		<div className="w-64 bg-white border border-dashed border-zinc-200 text-zinc-800 p-4 flex flex-col h-screen fixed top-0 left-0">
			<h2 className="text-2xl font-bold mb-6 text-zinc-800">Billr Dashboard</h2>

			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-2 text-zinc-600">
					My Companies
				</h3>
				{companies.length === 0 ? (
					<p className="text-zinc-500 text-sm">No companies saved.</p>
				) : (
					<ul className="space-y-2">
						{companies.map((company) => (
							<li
								key={company.id}
								className="group flex justify-between items-center"
							>
								<button
									onClick={() => onSelectCompany(company)}
									className="text-zinc-700 hover:text-black transition-colors text-left flex-grow"
								>
									{company.name}
								</button>
								{/* Add edit/delete buttons here if needed */}
							</li>
						))}
					</ul>
				)}
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2 text-zinc-600">Clients</h3>
				{clients.length === 0 ? (
					<p className="text-zinc-500 text-sm">No clients saved.</p>
				) : (
					<ul className="space-y-2">
						{clients.map((client) => (
							<li
								key={client.id}
								className="group flex justify-between items-center"
							>
								<button
									onClick={() => onSelectClient(client)}
									className="text-zinc-700 hover:text-black transition-colors text-left flex-grow"
								>
									{client.name}
								</button>
								{/* Add edit/delete buttons here if needed */}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
