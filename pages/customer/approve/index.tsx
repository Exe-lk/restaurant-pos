import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card, {
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Swal from 'sweetalert2';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { TableView } from '../../../components/icon/material-icons';

const NextPage = () => {
	const router = useRouter();
	const { data }: any = router.query;
	const [foodData, setFood] = useState<any[]>([]);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [table, settable] = useState<any>('');

	useEffect(() => {
		const table = localStorage.getItem('table');
		if (table) {
			settable(table);
		}
		if (data) {
			const parsedData = JSON.parse(data);
			console.log(parsedData); // Use the data here
			setFood(parsedData);

			// Calculate the total price
			const total = parsedData.reduce((sum: number, item: any) => {
				return sum + item.price * item.points;
			}, 0);
			setTotalPrice(total);
		}
	}, [data ,]);
	const handlesubmit = () => {
		Swal.fire({
			title: 'Processing...',
			html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
			allowOutsideClick: false,
			showCancelButton: false,
			showConfirmButton: false,
		});

		const collectionRef = collection(firestore, 'order');

		addDoc(collectionRef, { foodData, table, status: 'Pending to Prepare' })
			.then(() => {
				Swal.close();
				router.push('/customer/menu');
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				alert('An error occurred while adding the document. Please try again later.');
			});
	};
	const handlePointsChange = (employeeId: string, action: 'add' | 'subtract') => {
		const updatedFoodData = foodData.map((foodData) => {
			if (foodData.cid === employeeId) {
				let currentPoints = parseFloat(foodData.points);
				currentPoints = action === 'add' ? currentPoints + 1 : currentPoints - 1;

				return { ...foodData, points: currentPoints };
			}
			return foodData;
		});
		const total =updatedFoodData.reduce((sum: number, item: any) => {
			return sum + item.price * item.points;
		}, 0);
		setTotalPrice(total);
		setFood(updatedFoodData);
	};
	return (
		<div className='col-xl-12 bg-dark justify-content-center min-vh-100 min-vw-100'>
			{/* Title and Subtitle Section */}
			<div className='text-center text-white m-4'>
				<h1 className='fw-bold'>Order Details</h1>
				<p className='fs-5'>Let's Start Tasting ....!</p>
			</div>
			<Card className='bg-dark'>
				<CardBody>
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
										<div className='text-muted fs-6 mb-3'>{item.category}</div>

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
													boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
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
														boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
													}}
													onClick={() =>
														handlePointsChange(item.cid, 'subtract')
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
														boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
													}}
													onClick={() =>
														handlePointsChange(item.cid, 'add')
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
				</CardBody>
				<h3 className='fw-bold' style={{color:"white", padding: '0 20px',}}>Summary</h3>
				<div
					style={{
						position: 'relative',
						marginTop: '40px',
						color: 'white',
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
						<div>Subtotal</div>
						<div>Rs. {totalPrice}.00</div>
					
					</div>
					
				</div>
				<div
					style={{
						position: 'relative',
						marginTop: '40px',
						color: 'white',
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
						<div>Discount</div>
						<div>--</div>
					
					</div>
					
				</div>
				<div
					style={{
						position: 'relative',
						marginTop: '40px',
						color: 'white',
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
						<div>Service Charge</div>
						<div>Rs. {(totalPrice/100)*10}.00</div>
					
					</div>
					
				</div>
				<div
					style={{
						position: 'relative',
						marginTop: '40px',
						color: 'white',
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
						<div><b>Total</b></div>
						<div><b>Rs. {(totalPrice/100)*110}.00</b></div>
					
					</div>
					
				</div>
				
				
			</Card>
			<div className='d-flex w-60 justify-content-center'>
				<Button
							color='success'
							onClick={handlesubmit}
							style={{
								marginTop:10,
								backgroundColor: '#f75205', // Change background color to orange
								width: '200px', // Increase the width
								borderRadius: 50, // Adjust border radius
								border: 'none', // Remove the default border
								fontSize:19
							}}>
							Order
						</Button>
				</div>
		</div>
	);
};

export default NextPage;
