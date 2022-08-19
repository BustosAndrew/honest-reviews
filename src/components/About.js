import { Typography, Box } from "@mui/material";

export const About = () => {
	return (
		<Box>
			<Typography variant="subtitle1">
				In late May 2022 I attended Star Wars Celebration Anaheim and
				when I met up with my Airbnb roommates to settle in, things went
				awry. After bringing up issues to Airbnb about the listing, it
				was delisted and then the host kicked us all out as a result.
				Unfortunately, no one on the platform can know of what happened
				at the listing since we didn't complete our stay. This site came
				to be to help customers make informed decisions when other
				customers can't make reviews due to certain company policies on
				their platform. However, this site isn't limited to hotel/Airbnb
				reviews, because anyone can review whatever they want! Just make
				sure all reviews are honest! Or else 😈
			</Typography>
			<br />
			<lottie-player
				src="https://assets6.lottiefiles.com/packages/lf20_2hYese.json"
				background="transparent"
				speed=".75"
				style={{ width: "300px", height: "300px", margin: "0 auto" }}
				autoplay
				loop
			></lottie-player>
		</Box>
	);
};
