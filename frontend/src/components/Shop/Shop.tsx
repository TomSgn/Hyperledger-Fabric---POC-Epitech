// src/components/Shop/Shop.tsx
import React from 'react';
import { Product } from './Types_Shop';

type ShopProps = {
  products: Product[];
};

const Shop: React.FC<ShopProps> = ({ products }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <img src={product.imageUrl} alt={product.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <p><strong>Provenance:</strong> {`${product.provenance}`} </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy for Wynit:{product.price}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
