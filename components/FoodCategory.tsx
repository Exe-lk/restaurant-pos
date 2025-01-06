import React, { useState } from 'react';
import Card from '../components/bootstrap/Card';
import Button from '../components/bootstrap/Button';

const FoodCategory = ({ items, handlePointsChange }: any) => {
  // Group items by category
  const groupedItems = items.reduce((acc: any, item: any) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Extract category keys
  const categories = Object.keys(groupedItems);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div>
      {/* Category Buttons */}
      <div className="mb-3 d-flex">
        {categories.map((category) => (
          <Button
            key={category}
            className={`text-white ${activeCategory === category ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              flex: 1,
              margin: '0 5px',
              borderRadius: '8px',
            }}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Items in Active Category */}
      <div className="row g-4">
        {groupedItems[activeCategory]?.map((item: any) => (
          <div key={item.cid} className="col-md-12">
            <Card
              shadow="lg"
              borderSize={4}
              borderColor={item.points > 0 ? 'danger' : 'none'}
              className="mb-1 d-flex align-items-center"
            >
              <div className="d-flex w-100">
                {/* Image Section */}
                <div className="flex-shrink-0 me-3">
                  <img
                    src={item.imageurl}
                    alt={item.name}
                    className="img-fluid"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '75px',
                      borderRadius: '8px 0px 0px 8px',
                    }}
                  />
                </div>

                {/* Data Section */}
                <div className="flex-grow-1 ms-1">
                  <div className="fw-bold fs-4">{item.name}</div>
                  <div className="text-muted fs-6 mb-3">{item.category}</div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="text-danger fs-5 mb-2">Rs {item.price}.00</div>
                    <div
                      className="d-flex align-items-center justify-content-between p-1"
                      style={{
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        borderRadius: '30px',
                        background: '#fff',
                      }}
                    >
                      <Button
                        color="warning"
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
                        onClick={() => handlePointsChange(item.cid, 'subtract')}
                      >
                        -
                      </Button>
                      <div
                        className="ms-2 me-2 text-center"
                        style={{
                          fontWeight: 'bold',
                          color: '#333',
                          fontSize: '18px',
                        }}
                      >
                        {item.points}
                      </div>
                      <Button
                        color="warning"
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
                        onClick={() => handlePointsChange(item.cid, 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategory;
