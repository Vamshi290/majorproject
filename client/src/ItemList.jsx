import React from "react";

function ItemList({ items, error, itemType }) {
    return (
        <div className="container">
            <h2 className="text-center mb-4">{itemType === "lost" ? "Lost Items" : "Found Items"}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {items.length === 0 ? (
                    <div className="alert alert-info">No {itemType} items found.</div>
                ) : (
                    items.map((item, index) => (
                        <div className="col-md-4 mb-3" key={index}>
                            <div className="card">
                                <img 
                                    src={`http://127.0.0.1:3001/${item.image}`} 
                                    className="card-img-top" 
                                    alt={`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Item`} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Posted on: {item.date ? new Date(item.date).toLocaleDateString() : "Date not provided"}
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ItemList;
