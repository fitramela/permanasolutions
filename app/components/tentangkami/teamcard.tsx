"use client";

import Image from "next/image";


interface TeamCardProps {

 image:string;
 name:string;
 position:string;
 description:string;

 active:boolean;

 onClick:()=>void;

}



export default function TeamCard({

 image,
 name,
 position,
 description,
 active,
 onClick

}:TeamCardProps){


return (

<div
onClick={onClick}

className={`
relative
cursor-pointer
pt-20
transition-all
duration-500

${active 
? "scale-105 -translate-y-4"
: "opacity-70"
}

`}
>


{/* FOTO */}

<div
className="
absolute
left-1/2
top-0
z-20
-translate-x-1/2
"
>


<div

className={`
h-36
w-36
overflow-hidden
rounded-full
border-[5px]
border-white

shadow-xl

transition-all
duration-500

${active 
? "ring-4 ring-[#00C4CC]"
:""
}

`}
>


<Image

src={image}

alt={name}

width={150}

height={150}

className="
h-full
w-full
object-cover
"

/>


</div>

</div>



{/* CARD */}


<div

className={`

h-[360px]

rounded-[30px]

border

px-6
pb-8
pt-28


transition-all
duration-500


${active

?

"bg-white shadow-[0_20px_50px_rgba(0,196,204,.25)] border-[#00C4CC]"

:

"bg-white border-[#E7E7E7] shadow-sm"

}


`}

>


{/* BADGE */}

<div

className="

mx-auto

w-fit

rounded-md

bg-[#00C4CC]

px-5

py-1

text-sm

font-semibold

text-white

"

>

{position}

</div>




{/* NAME */}

<h3

className="
mt-5
text-center
font-serif
text-xl
font-bold
text-[#003E63]
"

>

{name}

</h3>




{/* DESCRIPTION */}

<p

className="
mt-8
text-center
text-sm
leading-7
text-gray-500
"

>

{description}

</p>



</div>


</div>

)

}