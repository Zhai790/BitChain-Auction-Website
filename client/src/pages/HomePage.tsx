import React, { JSX, useEffect, useRef, useState } from 'react';
import './HomePage.css';
import { NFTCard } from '../components/NFTCard';
import { PrimaryButton } from '../components/button';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { CATEGORIES } from '../data/category';
import { CategoryCard } from '../components/CategoryCard';
import { useNavigate } from 'react-router-dom';
import { InformationCard } from '../components/InformationCard';
import { Information_Card_Data } from '../data/information';
import { nftQueries } from '../graphql/queries/nftQueries';
import { NFT } from '../types/nft';
import { toast } from 'react-toastify';

const sampleNFTCard = {
  id: '1',
  name: 'Bored Ape',
  imageUrl: '/bored-ape.png',
  creatorName: 'Test Creator',
  creatorAvatarUrl: '/avatar.png',
  creator: {
    id: '1',
    name: 'Animakid',
  },
  isActive:false
};

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const infoSectionRef = useRef<HTMLDivElement|null>(null);
  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(categoryTitle)}`);
  };
  const [nft, setNFT] = useState<NFT>();

  const scrollToInfoSection = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    async function loadNFT(){
        try{
          const fetched = await nftQueries.getNFTById("1");
          setNFT(fetched);
        }
        catch{
          toast.error("Coudnt Load HomePage NFT.");
        }
    }

    loadNFT();
  }, [])
  

  

  return (
    <main className="homepage">
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Discover <br />
            Digital Art & <br />
            Collect NFTs
          </h1>

          <p className="hero-sub">
            BidChain — A transparent, NFT auction platform designed to deliver
            live bidding excitement and powerful tools for creators and
            collectors alike.
          </p>

          <div className="get-started-btn">
            <PrimaryButton text="Get Started" icon={RocketLaunchIcon} onClick={scrollToInfoSection} />
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-num">240k+</div>
              <div className="stat-label">Total Sale</div>
            </div>
            <div className="stat">
              <div className="stat-num">100k+</div>
              <div className="stat-label">Auctions</div>
            </div>
            <div className="stat">
              <div className="stat-num">240k+</div>
              <div className="stat-label">Artists</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="image-container">
            {nft && <NFTCard key= {nft.id} nft={nft} />}
          </div>
        </div>
      </section>
      <section className="categories">
        <div className="categories-head">
          <h2>Browse by Category</h2>
          <p className="categories-sub">Find art that matches your vibe.</p>
        </div>

        <div className="categories-grid">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onClick={() => handleCategoryClick(cat.title)}
          style={{ cursor: 'pointer' }}
        >
          <CategoryCard category={cat} />
        </div>
      ))}
    </div>
      </section>

      <section className="info-section" ref={infoSectionRef}>
        <div className="info-heading">
          <h2>How It Works</h2>
          <p className="info-sub">Find out how to get started.</p>
        </div>

        <div className="info-grid">
          {Information_Card_Data.map((data) => (
            <InformationCard key={data.id} data={data} />
          ))}
        </div>
    </section>
    </main>
  );
}
