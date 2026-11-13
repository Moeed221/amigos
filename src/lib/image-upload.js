// Keep original proportions. Product uploads are fitted to a 1080 px square.
export async function prepareImage(file,{square=false}={}){
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10000000)throw Error('Choose a PNG, JPEG or WebP under 10 MB.');
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();img.src=url;await img.decode();
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  const ratio=Math.min((square?1080:1600)/img.width,(square?1080:1600)/img.height);
  canvas.width=square?1080:Math.round(img.width*ratio);canvas.height=square?1080:Math.round(img.height*ratio);
  if(square){ctx.fillStyle='#ead8b8';ctx.fillRect(0,0,1080,1080);}
  const w=Math.round(img.width*ratio),h=Math.round(img.height*ratio);ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  let output;for(const quality of [.85,.7,.55,.4]){output=canvas.toDataURL('image/webp',quality);if(output.length<450000)return output;}
  throw Error('This image is too detailed to store locally. Try a smaller file.');
 }finally{URL.revokeObjectURL(url)}
}

export async function requireSquareProductImage(src){
 const img=new Image();img.src=src;
 try{await img.decode()}catch{throw Error('The product image could not be loaded. Check the URL or upload a file.')}
 if(img.naturalWidth!==1080||img.naturalHeight!==1080)throw Error('Product images must be 1080 × 1080. Upload the file to resize it automatically.');
}
