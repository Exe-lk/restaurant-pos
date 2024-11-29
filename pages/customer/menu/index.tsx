import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { useRouter } from 'next/router';

const Index = () => {
	const router = useRouter();
	const [foodData, setFood] = useState<any[]>([]);
	const [liquorData, setLiquor] = useState<any[]>([]);
	const [activeButton, setActiveButton] = useState<'food' | 'liquor'>('food');
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'item');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						cid: doc.id,
						points: 0,
					};
				});
				setFood(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'liquor');
				const querySnapshot = await getDocs(dataCollection);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						cid: doc.id,
						points: 0,
					};
				});
				setLiquor(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	const handlePointsChange = (employeeId: string, action: 'add' | 'subtract') => {
		const updatedFoodData = foodData.map((foodData) => {
			if (foodData.cid === employeeId) {
				let currentPoints = parseFloat(foodData.points);
				currentPoints = action === 'add' ? currentPoints + 1 : currentPoints - 1;

				return { ...foodData, points: currentPoints };
			}
			return foodData;
		});

		setFood(updatedFoodData);
	};
	const handlePointsChange1 = (employeeId: string, action: 'add' | 'subtract') => {
		const updatedFoodData = liquorData.map((foodData) => {
			if (foodData.cid === employeeId) {
				let currentPoints = parseFloat(foodData.points);
				currentPoints = action === 'add' ? currentPoints + 1 : currentPoints - 1;

				return { ...foodData, points: currentPoints };
			}
			return foodData;
		});

		setLiquor(updatedFoodData);
	};

	const handleNext = () => {
		// Combine foodData and liquorData, adding an orderType field
		const combinedData = [
		  ...foodData.map((item) => ({ ...item, orderType: 'food' })),
		  ...liquorData.map((item) => ({ ...item, orderType: 'liquor' })),
		];
	  
		// Filter items with points > 0
		const selectedItems = combinedData.filter((item) => item.points >= 1);
	  
		// Navigate to the next page with the selected items
		router.push({
		  pathname: '/customer/approve', // Replace with your actual next page route
		  query: { data: JSON.stringify(selectedItems) },
		});
	  };
	  

	return (
		<div className='col-xl-12 bg-dark justify-content-center min-vh-100  min-vw-100'>
			{/* Title and Subtitle Section */}
			<div className='text-center text-white m-4'>
				<h1 className='fw-bold'>Menu</h1>
				<p className='fs-5'>Let's Start Tasting ....!</p>
			</div>

			<Card className='bg-dark'>
				<CardTitle>
					<div style={{ display: 'flex', width: '100%' }}>
						{/* Food Button */}
						<Button
							className='text-white'
							style={{
								flex: 1,
								borderRadius: activeButton === 'liquor' ? '0 0 10px 0' : '0', // No border-radius for both buttons
								borderBottom: activeButton === 'food' ? 'none' : '1px solid #fff', // Remove bottom border on active button
								borderRight: activeButton === 'food' ? 'none' : '1px solid #fff',
								border: '1px solid #fff', // Standard border for all buttons
							}}
							onClick={() => setActiveButton('food')} // Set active to 'food' on click
						>
							Food
						</Button>

						{/* Liquor Button */}
						<Button
							className='text-white'
							style={{
								flex: 1,
								borderRadius: activeButton === 'food' ? '0 0 0 10px' : '0', // Increase bottom left corner radius when active
								borderBottom: activeButton === 'liquor' ? 'none' : '1px solid #fff', // Remove bottom border on active button
								borderLeft: activeButton === 'liquor' ? 'none' : '1px solid #fff',
								border: '1px solid #fff', // Standard border for all buttons
							}}
							onClick={() => setActiveButton('liquor')} // Set active to 'liquor' on click
						>
							Liquor
						</Button>
					</div>
				</CardTitle>

				<CardBody>
					<div className='row g-4'>
						{activeButton == 'food' ? (
							<>
								{foodData.map((item) => (
									<div key={item.cid} className='col-md-12'>
										<Card
											shadow='lg'
											borderSize={4}
											borderColor={item.points > 0 ? 'danger' : 'none'}
											className='mb-1 d-flex align-items-center'>
											<div className='d-flex w-100'>
												{/* Image Section */}
												<div className='flex-shrink-0 me-3'>
													<img
														src={item.imageurl}
														alt={item.name}
														className='img-fluid'
														style={{
															objectFit: 'cover',
															width: '100%',
															height: '75px',
															borderRadius: '8px 0px 0px 8px',
														}}
													/>
												</div>

												{/* Data Section */}
												<div className='flex-grow-1 ms-1'>
													{/* Name */}
													<div className='fw-bold fs-4'>{item.name}</div>

													{/* Description */}
													<div className='text-muted fs-6 mb-3'>
														{item.category}
													</div>

													{/* Price and Buttons Section */}
													<div className='d-flex justify-content-between align-items-end'>
														{/* Price */}
														<div className='text-danger fs-5 mb-2'>
															Rs {item.price}.00
														</div>

														{/* Buttons */}
														<div
															className='d-flex align-items-center justify-content-between p-1'
															style={{
																boxShadow:
																	'0px 4px 15px rgba(0, 0, 0, 0.2)',
																borderRadius: '30px', // Elliptical shadow effect
																background: '#fff',
															}}>
															{/* Minus Button */}
															<Button
																color='warning'
																style={{
																	width: '25px',
																	height: '25px',
																	borderRadius: '50%',
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	fontSize: '20px',
																	boxShadow:
																		'0px 2px 5px rgba(0, 0, 0, 0.1)',
																}}
																onClick={() =>
																	handlePointsChange(
																		item.cid,
																		'subtract',
																	)
																}>
																-
															</Button>

															{/* Points Display */}
															<div
																className='flex-grow-1 ms-2 me-2 text-center'
																style={{
																	fontWeight: 'bold',
																	color: '#333',
																	fontSize: '18px',
																}}>
																{item.points}
															</div>

															{/* Plus Button */}
															<Button
																color='warning'
																style={{
																	width: '25px',
																	height: '25px',
																	borderRadius: '50%',
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	fontSize: '20px',
																	boxShadow:
																		'0px 2px 5px rgba(0, 0, 0, 0.1)',
																}}
																onClick={() =>
																	handlePointsChange(
																		item.cid,
																		'add',
																	)
																}>
																+
															</Button>
														</div>
													</div>
												</div>
											</div>
										</Card>
									</div>
								))}
							</>
						) : (
							<>
								{liquorData.map((item) => (
									<div key={item.cid} className='col-md-12'>
										<Card
											shadow='lg'
											borderSize={4}
											borderColor={item.points > 0 ? 'danger' : 'none'}
											className='mb-1 d-flex align-items-center'>
											<div className='d-flex w-100'>
												{/* Image Section */}
												<div className='flex-shrink-0 me-3'>
													<img
														src={item.imageurl}
														alt={item.name}
														className='img-fluid'
														style={{
															objectFit: 'cover',
															width: '100%',
															height: '75px',
															borderRadius: '8px 0px 0px 8px',
														}}
													/>
												</div>

												{/* Data Section */}
												<div className='flex-grow-1 ms-1'>
													{/* Name */}
													<div className='fw-bold fs-4'>{item.name}</div>

													{/* Description */}
													<div className='text-muted fs-6 mb-3'>
														{item.category}
													</div>

													{/* Price and Buttons Section */}
													<div className='d-flex justify-content-between align-items-end'>
														{/* Price */}
														<div className='text-danger fs-5 mb-2'>
															Rs {item.price}.00
														</div>

														{/* Buttons */}
														<div
															className='d-flex align-items-center justify-content-between p-1'
															style={{
																boxShadow:
																	'0px 4px 15px rgba(0, 0, 0, 0.2)',
																borderRadius: '30px', // Elliptical shadow effect
																background: '#fff',
															}}>
															{/* Minus Button */}
															<Button
																color='warning'
																style={{
																	width: '25px',
																	height: '25px',
																	borderRadius: '50%',
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	fontSize: '20px',
																	boxShadow:
																		'0px 2px 5px rgba(0, 0, 0, 0.1)',
																}}
																onClick={() =>
																	handlePointsChange1(
																		item.cid,
																		'subtract',
																	)
																}>
																-
															</Button>

															{/* Points Display */}
															<div
																className='flex-grow-1 ms-2 me-2 text-center'
																style={{
																	fontWeight: 'bold',
																	color: '#333',
																	fontSize: '18px',
																}}>
																{item.points}
															</div>

															{/* Plus Button */}
															<Button
																color='warning'
																style={{
																	width: '25px',
																	height: '25px',
																	borderRadius: '50%',
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	fontSize: '20px',
																	boxShadow:
																		'0px 2px 5px rgba(0, 0, 0, 0.1)',
																}}
																onClick={() =>
																	handlePointsChange1(
																		item.cid,
																		'add',
																	)
																}>
																+
															</Button>
														</div>
													</div>
												</div>
											</div>
										</Card>
									</div>
								))}
							</>
						)}
					</div>
				</CardBody>
			</Card>
			<div
				style={{
					position: 'relative',
					marginTop: 75,
					// Ensure the container takes the full height of the viewport
				}}>
				<div
					style={{
						position: 'absolute',
						bottom: '20px',
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 20px', // Add some padding for alignment
					}}>
					{/* Back Button */}
					<Button
						style={{
							backgroundColor: '#f75205',
							borderRadius: '50px',
							color: '#fff',
							border: 'none',
							padding: '10px 20px',
						}}
						onClick={() => router.push('/customer')}>
						Back
					</Button>

					{/* Next Button */}
					<Button
						style={{
							backgroundColor: '#f75205',
							borderRadius: '50px',
							color: '#fff',
							border: 'none',
							padding: '10px 20px',
						}}
						onClick={handleNext}>
						NEXT
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Index;
