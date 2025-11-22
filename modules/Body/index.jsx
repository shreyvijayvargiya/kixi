import React from "react";
import { ToastContainer } from "react-toastify";

const Body = ({ children }) => {
	return (
		<div>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				className="z-50"
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				style={{ zIndex: 9999 }}
			/>
			{children}
		</div>
	);
};

export default Body;
