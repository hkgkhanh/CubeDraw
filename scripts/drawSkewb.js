
var cubeS = [[w, w, w, w, w],
				 [o, o, o, o, o],
				 [g, g, g, g, g],
				 [r, r, r, r, r],
				 [b, b, b, b, b],
				 [y, y, y, y, y]];

/*               u1
		       u2  u3  u4
		           u5
l1  l2    f1  f2    r1  r2    b1  b2
  l3 	      f3        r3        b3
l4  l5    f4  f5    r4  r5	   b4  b5
					  d1
				 d2  d3  d4
				     d5
*/

function drawCubeS(scram) {
	initCubeArr("skb");

	let scr = getSequence("3", scram);
	let temp;

	for (let i = 0; i < scr.length; i++) {
		switch (scr[i]) {
			case "R":
				temp = cubeS[3][3];
				cubeS[3][3] = cubeS[5][4];
				cubeS[5][4] = cubeS[4][0];
				cubeS[4][0] = temp;

				temp = cubeS[3][1];
				cubeS[3][1] = cubeS[5][0];
				cubeS[5][0] = cubeS[4][4];
				cubeS[4][4] = temp;

				temp = cubeS[0][3];
				cubeS[0][3] = cubeS[2][4];
				cubeS[2][4] = cubeS[1][3];
				cubeS[1][3] = temp;

				temp = cubeS[3][4];
				cubeS[3][4] = cubeS[5][3];
				cubeS[5][3] = cubeS[4][3];
				cubeS[4][3] = temp;

				temp = cubeS[3][2];
				cubeS[3][2] = cubeS[5][2];
				cubeS[5][2] = cubeS[4][2];
				cubeS[4][2] = temp;
				break;

			case "L":
				temp = cubeS[2][0];
				cubeS[2][0] = cubeS[1][3];
				cubeS[1][3] = cubeS[5][0];
				cubeS[5][0] = temp;

				temp = cubeS[1][1];
				cubeS[1][1] = cubeS[5][4];
				cubeS[5][4] = cubeS[2][4];
				cubeS[2][4] = temp;

				temp = cubeS[0][1];
				cubeS[0][1] = cubeS[4][4];
				cubeS[4][4] = cubeS[3][3];
				cubeS[3][3] = temp;

				temp = cubeS[2][3];
				cubeS[2][3] = cubeS[1][4];
				cubeS[1][4] = cubeS[5][1];
				cubeS[5][1] = temp;

				temp = cubeS[2][2];
				cubeS[2][2] = cubeS[1][2];
				cubeS[1][2] = cubeS[5][2];
				cubeS[5][2] = temp;
				break;

			case "U":
				temp = cubeS[0][1];
				cubeS[0][1] = cubeS[4][0];
				cubeS[4][0] = cubeS[1][3];
				cubeS[1][3] = temp;

				temp = cubeS[0][3];
				cubeS[0][3] = cubeS[4][4];
				cubeS[4][4] = cubeS[1][1];
				cubeS[1][1] = temp;

				temp = cubeS[2][0];
				cubeS[2][0] = cubeS[3][1];
				cubeS[3][1] = cubeS[5][4];
				cubeS[5][4] = temp;

				temp = cubeS[0][0];
				cubeS[0][0] = cubeS[4][1];
				cubeS[4][1] = cubeS[1][0];
				cubeS[1][0] = temp;

				temp = cubeS[0][2];
				cubeS[0][2] = cubeS[4][2];
				cubeS[4][2] = cubeS[1][2];
				cubeS[1][2] = temp;
				break;

			case "B":
				temp = cubeS[0][0];
				cubeS[0][0] = cubeS[3][4];
				cubeS[3][4] = cubeS[2][3];
				cubeS[2][3] = temp;

				temp = cubeS[1][0];
				cubeS[1][0] = cubeS[4][3];
				cubeS[4][3] = cubeS[5][1];
				cubeS[5][1] = temp;

				temp = cubeS[4][1];
				cubeS[4][1] = cubeS[5][3];
				cubeS[5][3] = cubeS[1][4];
				cubeS[1][4] = temp;

				temp = cubeS[4][4];
				cubeS[4][4] = cubeS[5][4];
				cubeS[5][4] = cubeS[1][3];
				cubeS[1][3] = temp;

				temp = cubeS[4][2];
				cubeS[4][2] = cubeS[5][2];
				cubeS[5][2] = cubeS[1][2];
				cubeS[1][2] = temp;
				break;
		}
	}
	//console.table(cubeS);
	document.getElementById("skb_U1").style.fill = cubeS[0][0];
	document.getElementById("skb_U2").style.fill = cubeS[0][1];
	document.getElementById("skb_U3").style.fill = cubeS[0][2];
	document.getElementById("skb_U4").style.fill = cubeS[0][3];
	document.getElementById("skb_U5").style.fill = cubeS[0][4];
	document.getElementById("skb_L1").style.fill = cubeS[1][0];
	document.getElementById("skb_L2").style.fill = cubeS[1][1];
	document.getElementById("skb_L3").style.fill = cubeS[1][2];
	document.getElementById("skb_L4").style.fill = cubeS[1][3];
	document.getElementById("skb_L5").style.fill = cubeS[1][4];
	document.getElementById("skb_F1").style.fill = cubeS[2][0];
	document.getElementById("skb_F2").style.fill = cubeS[2][1];
	document.getElementById("skb_F3").style.fill = cubeS[2][2];
	document.getElementById("skb_F4").style.fill = cubeS[2][3];
	document.getElementById("skb_F5").style.fill = cubeS[2][4];
	document.getElementById("skb_R1").style.fill = cubeS[3][0];
	document.getElementById("skb_R2").style.fill = cubeS[3][1];
	document.getElementById("skb_R3").style.fill = cubeS[3][2];
	document.getElementById("skb_R4").style.fill = cubeS[3][3];
	document.getElementById("skb_R5").style.fill = cubeS[3][4];
	document.getElementById("skb_B1").style.fill = cubeS[4][0];
	document.getElementById("skb_B2").style.fill = cubeS[4][1];
	document.getElementById("skb_B3").style.fill = cubeS[4][2];
	document.getElementById("skb_B4").style.fill = cubeS[4][3];
	document.getElementById("skb_B5").style.fill = cubeS[4][4];
	document.getElementById("skb_D1").style.fill = cubeS[5][0];
	document.getElementById("skb_D2").style.fill = cubeS[5][1];
	document.getElementById("skb_D3").style.fill = cubeS[5][2];
	document.getElementById("skb_D4").style.fill = cubeS[5][3];
	document.getElementById("skb_D5").style.fill = cubeS[5][4];
}