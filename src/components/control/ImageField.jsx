'use client';
import {useState} from 'react';
import {prepareImage} from '../../lib/image-upload';
import {Field} from './ControlPortal';
export default function ImageField({label,value,onChange,square=false}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function upload(e){const file=e.target.files?.[0];if(!file)return;setError('');setBusy(true);try{onChange(await prepareImage(file,{square}))}catch(e){setError(e.message)}finally{setBusy(false);e.target.value=''}}
 return <div className="ac-image-field"><Field label={label+' URL'} hint={square?'Use a 1080 × 1080 image, or upload below to resize automatically.':'Local path or HTTPS image URL.'}><input value={value?.startsWith('data:')?'':value||''} placeholder={value?.startsWith('data:')?'Uploaded image selected':''} onChange={e=>onChange(e.target.value)}/></Field><Field label={'Upload '+label.toLowerCase()} hint={square?'PNG, JPEG or WebP · fitted to 1080 × 1080 without stretching.':'PNG, JPEG or WebP · up to 10 MB, optimised on upload.'}><input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={upload}/></Field>{busy&&<p role="status">Preparing image…</p>}{error&&<p className="ac-error" role="alert">{error}</p>}{value&&<img className="ac-upload-preview" src={value} alt={label+' preview'}/>}</div>
}
