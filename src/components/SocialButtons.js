import React from 'react';


export default function SocialButtons() {  
  return (
    <div id='social-buttons'>
      <div 
        className="fb-share-button" 
        data-href="https://lifecalender.me" 
        data-layout="button" 
        data-size="small"
      >
        <a 
          target="_blank" 
          rel="noopener noreferrer"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flifecalender.me%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore"
          value='Share'
        > </a>       
      </div>
      <a 
        href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" 
        data-show-count="false"
        value='Tweet'
      > </a>      
      <a 
        className="github-button" 
        href="https://github.com/vic2019/life-calendar"
      >Source</a>
    </div>
  );
};