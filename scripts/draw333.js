var cube3 = [[w, w, w, w, w, w, w, w, w],
				 [o, o, o, o, o, o, o, o, o],
				 [g, g, g, g, g, g, g, g, g],
				 [r, r, r, r, r, r, r, r, r],
				 [b, b, b, b, b, b, b, b, b],
				 [y, y, y, y, y, y, y, y, y]];

/*         u1 u2 u3
	        u4 u5 u6
	        u7 u8 u9

l1 l2 l3   f1 f2 f3   r1 r2 r3   b1 b2 b3
l4 l5 l6   f4 f5 f6   r4 r5 r6   b4 b5 b6
l7 l8 l9   f7 f8 f9   r7 r8 r9   b7 b8 b9

           d1 d2 d3
           d4 d5 d6
           d7 d8 d9
*/

function drawCube3(scram) {
	initCubeArr("333");

	let scr = getSequence("4", scram);
	let temp;

	for (let i = 0; i < scr.length; i++) {
		switch (scr[i]) {
			case "R":
				temp = cube3[0][8];
				cube3[0][8] = cube3[2][8];
				cube3[2][8] = cube3[5][8];
				cube3[5][8] = cube3[4][0];
				cube3[4][0] = temp;

				temp = cube3[2][2];
				cube3[2][2] = cube3[5][2];
				cube3[5][2] = cube3[4][6];
				cube3[4][6] = cube3[0][2];
				cube3[0][2] = temp;

				temp = cube3[0][5];
				cube3[0][5] = cube3[2][5];
				cube3[2][5] = cube3[5][5];
				cube3[5][5] = cube3[4][3];
				cube3[4][3] = temp;

				temp = cube3[3][0];
				cube3[3][0] = cube3[3][6];
				cube3[3][6] = cube3[3][8];
				cube3[3][8] = cube3[3][2];
				cube3[3][2] = temp;

				temp = cube3[3][1];
				cube3[3][1] = cube3[3][3];
				cube3[3][3] = cube3[3][7];
				cube3[3][7] = cube3[3][5];
				cube3[3][5] = temp;
				break;

			case "L":
				temp = cube3[0][6];
				cube3[0][6] = cube3[4][2];
				cube3[4][2] = cube3[5][6];
				cube3[5][6] = cube3[2][6];
				cube3[2][6] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[0][0];
				cube3[0][0] = cube3[4][8];
				cube3[4][8] = cube3[5][0];
				cube3[5][0] = temp;

				temp = cube3[0][3];
				cube3[0][3] = cube3[4][5];
				cube3[4][5] = cube3[5][3];
				cube3[5][3] = cube3[2][3];
				cube3[2][3] = temp;

				temp = cube3[1][0];
				cube3[1][0] = cube3[1][6];
				cube3[1][6] = cube3[1][8];
				cube3[1][8] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[1][1];
				cube3[1][1] = cube3[1][3];
				cube3[1][3] = cube3[1][7];
				cube3[1][7] = cube3[1][5];
				cube3[1][5] = temp;
				break;

			case "U":
				temp = cube3[2][0];
				cube3[2][0] = cube3[3][0];
				cube3[3][0] = cube3[4][0];
				cube3[4][0] = cube3[1][0];
				cube3[1][0] = temp;

				temp = cube3[2][2];
				cube3[2][2] = cube3[3][2];
				cube3[3][2] = cube3[4][2];
				cube3[4][2] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[2][1];
				cube3[2][1] = cube3[3][1];
				cube3[3][1] = cube3[4][1];
				cube3[4][1] = cube3[1][1];
				cube3[1][1] = temp;

				temp = cube3[0][0];
				cube3[0][0] = cube3[0][6];
				cube3[0][6] = cube3[0][8];
				cube3[0][8] = cube3[0][2];
				cube3[0][2] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[0][3];
				cube3[0][3] = cube3[0][7];
				cube3[0][7] = cube3[0][5];
				cube3[0][5] = temp;
				break;

			case "D":
				temp = cube3[2][6];
				cube3[2][6] = cube3[1][6];
				cube3[1][6] = cube3[4][6];
				cube3[4][6] = cube3[3][6];
				cube3[3][6] = temp;

				temp = cube3[2][8];
				cube3[2][8] = cube3[1][8];
				cube3[1][8] = cube3[4][8];
				cube3[4][8] = cube3[3][8];
				cube3[3][8] = temp;

				temp = cube3[2][7];
				cube3[2][7] = cube3[1][7];
				cube3[1][7] = cube3[4][7];
				cube3[4][7] = cube3[3][7];
				cube3[3][7] = temp;

				temp = cube3[5][0];
				cube3[5][0] = cube3[5][6];
				cube3[5][6] = cube3[5][8];
				cube3[5][8] = cube3[5][2];
				cube3[5][2] = temp;

				temp = cube3[5][1];
				cube3[5][1] = cube3[5][3];
				cube3[5][3] = cube3[5][7];
				cube3[5][7] = cube3[5][5];
				cube3[5][5] = temp;
				break;

			case "F":
				temp = cube3[0][6];
				cube3[0][6] = cube3[1][8];
				cube3[1][8] = cube3[5][2];
				cube3[5][2] = cube3[3][0];
				cube3[3][0] = temp;

				temp = cube3[0][8];
				cube3[0][8] = cube3[1][2];
				cube3[1][2] = cube3[5][0];
				cube3[5][0] = cube3[3][6];
				cube3[3][6] = temp;

				temp = cube3[0][7];
				cube3[0][7] = cube3[1][5];
				cube3[1][5] = cube3[5][1];
				cube3[5][1] = cube3[3][3];
				cube3[3][3] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[2][6];
				cube3[2][6] = cube3[2][8];
				cube3[2][8] = cube3[2][2];
				cube3[2][2] = temp;

				temp = cube3[2][1];
				cube3[2][1] = cube3[2][3];
				cube3[2][3] = cube3[2][7];
				cube3[2][7] = cube3[2][5];
				cube3[2][5] = temp;
				break;

			case "B":
				temp = cube3[0][0];
				cube3[0][0] = cube3[3][2];
				cube3[3][2] = cube3[5][8];
				cube3[5][8] = cube3[1][6];
				cube3[1][6] = temp;

				temp = cube3[0][2];
				cube3[0][2] = cube3[3][8];
				cube3[3][8] = cube3[5][6];
				cube3[5][6] = cube3[1][0];
				cube3[1][0] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[3][5];
				cube3[3][5] = cube3[5][7];
				cube3[5][7] = cube3[1][3];
				cube3[1][3] = temp;

				temp = cube3[4][0];
				cube3[4][0] = cube3[4][6];
				cube3[4][6] = cube3[4][8];
				cube3[4][8] = cube3[4][2];
				cube3[4][2] = temp;

				temp = cube3[4][1];
				cube3[4][1] = cube3[4][3];
				cube3[4][3] = cube3[4][7];
				cube3[4][7] = cube3[4][5];
				cube3[4][5] = temp;
				break;

			case "r":
				temp = cube3[0][8];
				cube3[0][8] = cube3[2][8];
				cube3[2][8] = cube3[5][8];
				cube3[5][8] = cube3[4][0];
				cube3[4][0] = temp;

				temp = cube3[2][2];
				cube3[2][2] = cube3[5][2];
				cube3[5][2] = cube3[4][6];
				cube3[4][6] = cube3[0][2];
				cube3[0][2] = temp;

				temp = cube3[0][5];
				cube3[0][5] = cube3[2][5];
				cube3[2][5] = cube3[5][5];
				cube3[5][5] = cube3[4][3];
				cube3[4][3] = temp;

				temp = cube3[3][0];
				cube3[3][0] = cube3[3][6];
				cube3[3][6] = cube3[3][8];
				cube3[3][8] = cube3[3][2];
				cube3[3][2] = temp;

				temp = cube3[3][1];
				cube3[3][1] = cube3[3][3];
				cube3[3][3] = cube3[3][7];
				cube3[3][7] = cube3[3][5];
				cube3[3][5] = temp;


				temp = cube3[0][7];
				cube3[0][7] = cube3[2][7];
				cube3[2][7] = cube3[5][7];
				cube3[5][7] = cube3[4][1];
				cube3[4][1] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[2][1];
				cube3[2][1] = cube3[5][1];
				cube3[5][1] = cube3[4][7];
				cube3[4][7] = temp;

				temp = cube3[0][4];
				cube3[0][4] = cube3[2][4];
				cube3[2][4] = cube3[5][4];
				cube3[5][4] = cube3[4][4];
				cube3[4][4] = temp;
				break;

			case "u":
				temp = cube3[2][0];
				cube3[2][0] = cube3[3][0];
				cube3[3][0] = cube3[4][0];
				cube3[4][0] = cube3[1][0];
				cube3[1][0] = temp;

				temp = cube3[2][2];
				cube3[2][2] = cube3[3][2];
				cube3[3][2] = cube3[4][2];
				cube3[4][2] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[2][1];
				cube3[2][1] = cube3[3][1];
				cube3[3][1] = cube3[4][1];
				cube3[4][1] = cube3[1][1];
				cube3[1][1] = temp;

				temp = cube3[0][0];
				cube3[0][0] = cube3[0][6];
				cube3[0][6] = cube3[0][8];
				cube3[0][8] = cube3[0][2];
				cube3[0][2] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[0][3];
				cube3[0][3] = cube3[0][7];
				cube3[0][7] = cube3[0][5];
				cube3[0][5] = temp;


				temp = cube3[2][3];
				cube3[2][3] = cube3[3][3];
				cube3[3][3] = cube3[4][3];
				cube3[4][3] = cube3[1][3];
				cube3[1][3] = temp;

				temp = cube3[2][5];
				cube3[2][5] = cube3[3][5];
				cube3[3][5] = cube3[4][5];
				cube3[4][5] = cube3[1][5];
				cube3[1][5] = temp;

				temp = cube3[2][4];
				cube3[2][4] = cube3[3][4];
				cube3[3][4] = cube3[4][4];
				cube3[4][4] = cube3[1][4];
				cube3[1][4] = temp;
				break;

			case "f":
				temp = cube3[0][6];
				cube3[0][6] = cube3[1][8];
				cube3[1][8] = cube3[5][2];
				cube3[5][2] = cube3[3][0];
				cube3[3][0] = temp;

				temp = cube3[0][8];
				cube3[0][8] = cube3[1][2];
				cube3[1][2] = cube3[5][0];
				cube3[5][0] = cube3[3][6];
				cube3[3][6] = temp;

				temp = cube3[0][7];
				cube3[0][7] = cube3[1][5];
				cube3[1][5] = cube3[5][1];
				cube3[5][1] = cube3[3][3];
				cube3[3][3] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[2][6];
				cube3[2][6] = cube3[2][8];
				cube3[2][8] = cube3[2][2];
				cube3[2][2] = temp;

				temp = cube3[2][1];
				cube3[2][1] = cube3[2][3];
				cube3[2][3] = cube3[2][7];
				cube3[2][7] = cube3[2][5];
				cube3[2][5] = temp;


				temp = cube3[0][3];
				cube3[0][3] = cube3[1][7];
				cube3[1][7] = cube3[5][5];
				cube3[5][5] = cube3[3][1];
				cube3[3][1] = temp;

				temp = cube3[0][5];
				cube3[0][5] = cube3[1][1];
				cube3[1][1] = cube3[5][3];
				cube3[5][3] = cube3[3][7];
				cube3[3][7] = temp;

				temp = cube3[0][4];
				cube3[0][4] = cube3[1][4];
				cube3[1][4] = cube3[5][4];
				cube3[5][4] = cube3[3][4];
				cube3[3][4] = temp;
				break;

			case "M":
				temp = cube3[0][7];
				cube3[0][7] = cube3[4][1];
				cube3[4][1] = cube3[5][7];
				cube3[5][7] = cube3[2][7];
				cube3[2][7] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[4][7];
				cube3[4][7] = cube3[5][1];
				cube3[5][1] = cube3[2][1];
				cube3[2][1] = temp;

				temp = cube3[0][4];
				cube3[0][4] = cube3[4][4];
				cube3[4][4] = cube3[5][4];
				cube3[5][4] = cube3[2][4];
				cube3[2][4] = temp;
				break;

			case "x":
				// r
				temp = cube3[0][8];
				cube3[0][8] = cube3[2][8];
				cube3[2][8] = cube3[5][8];
				cube3[5][8] = cube3[4][0];
				cube3[4][0] = temp;

				temp = cube3[2][2];
				cube3[2][2] = cube3[5][2];
				cube3[5][2] = cube3[4][6];
				cube3[4][6] = cube3[0][2];
				cube3[0][2] = temp;

				temp = cube3[0][5];
				cube3[0][5] = cube3[2][5];
				cube3[2][5] = cube3[5][5];
				cube3[5][5] = cube3[4][3];
				cube3[4][3] = temp;

				temp = cube3[3][0];
				cube3[3][0] = cube3[3][6];
				cube3[3][6] = cube3[3][8];
				cube3[3][8] = cube3[3][2];
				cube3[3][2] = temp;

				temp = cube3[3][1];
				cube3[3][1] = cube3[3][3];
				cube3[3][3] = cube3[3][7];
				cube3[3][7] = cube3[3][5];
				cube3[3][5] = temp;


				temp = cube3[0][7];
				cube3[0][7] = cube3[2][7];
				cube3[2][7] = cube3[5][7];
				cube3[5][7] = cube3[4][1];
				cube3[4][1] = temp;

				temp = cube3[0][1];
				cube3[0][1] = cube3[2][1];
				cube3[2][1] = cube3[5][1];
				cube3[5][1] = cube3[4][7];
				cube3[4][7] = temp;

				temp = cube3[0][4];
				cube3[0][4] = cube3[2][4];
				cube3[2][4] = cube3[5][4];
				cube3[5][4] = cube3[4][4];
				cube3[4][4] = temp;

				//L
				temp = cube3[0][6];
				cube3[0][6] = cube3[4][2];
				cube3[4][2] = cube3[5][6];
				cube3[5][6] = cube3[2][6];
				cube3[2][6] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[0][0];
				cube3[0][0] = cube3[4][8];
				cube3[4][8] = cube3[5][0];
				cube3[5][0] = temp;

				temp = cube3[0][3];
				cube3[0][3] = cube3[4][5];
				cube3[4][5] = cube3[5][3];
				cube3[5][3] = cube3[2][3];
				cube3[2][3] = temp;

				temp = cube3[1][0];
				cube3[1][0] = cube3[1][6];
				cube3[1][6] = cube3[1][8];
				cube3[1][8] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[1][1];
				cube3[1][1] = cube3[1][3];
				cube3[1][3] = cube3[1][7];
				cube3[1][7] = cube3[1][5];
				cube3[1][5] = temp;

				//one more L
				temp = cube3[0][6];
				cube3[0][6] = cube3[4][2];
				cube3[4][2] = cube3[5][6];
				cube3[5][6] = cube3[2][6];
				cube3[2][6] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[0][0];
				cube3[0][0] = cube3[4][8];
				cube3[4][8] = cube3[5][0];
				cube3[5][0] = temp;

				temp = cube3[0][3];
				cube3[0][3] = cube3[4][5];
				cube3[4][5] = cube3[5][3];
				cube3[5][3] = cube3[2][3];
				cube3[2][3] = temp;

				temp = cube3[1][0];
				cube3[1][0] = cube3[1][6];
				cube3[1][6] = cube3[1][8];
				cube3[1][8] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[1][1];
				cube3[1][1] = cube3[1][3];
				cube3[1][3] = cube3[1][7];
				cube3[1][7] = cube3[1][5];
				cube3[1][5] = temp;

				//another L
				temp = cube3[0][6];
				cube3[0][6] = cube3[4][2];
				cube3[4][2] = cube3[5][6];
				cube3[5][6] = cube3[2][6];
				cube3[2][6] = temp;

				temp = cube3[2][0];
				cube3[2][0] = cube3[0][0];
				cube3[0][0] = cube3[4][8];
				cube3[4][8] = cube3[5][0];
				cube3[5][0] = temp;

				temp = cube3[0][3];
				cube3[0][3] = cube3[4][5];
				cube3[4][5] = cube3[5][3];
				cube3[5][3] = cube3[2][3];
				cube3[2][3] = temp;

				temp = cube3[1][0];
				cube3[1][0] = cube3[1][6];
				cube3[1][6] = cube3[1][8];
				cube3[1][8] = cube3[1][2];
				cube3[1][2] = temp;

				temp = cube3[1][1];
				cube3[1][1] = cube3[1][3];
				cube3[1][3] = cube3[1][7];
				cube3[1][7] = cube3[1][5];
				cube3[1][5] = temp;
				break;
		}
	}
	document.getElementById("333_U1").style.fill = cube3[0][0];
	document.getElementById("333_U2").style.fill = cube3[0][1];
	document.getElementById("333_U3").style.fill = cube3[0][2];
	document.getElementById("333_U4").style.fill = cube3[0][3];
	document.getElementById("333_U5").style.fill = cube3[0][4];
	document.getElementById("333_U6").style.fill = cube3[0][5];
	document.getElementById("333_U7").style.fill = cube3[0][6];
	document.getElementById("333_U8").style.fill = cube3[0][7];
	document.getElementById("333_U9").style.fill = cube3[0][8];
	document.getElementById("333_L1").style.fill = cube3[1][0];
	document.getElementById("333_L2").style.fill = cube3[1][1];
	document.getElementById("333_L3").style.fill = cube3[1][2];
	document.getElementById("333_L4").style.fill = cube3[1][3];
	document.getElementById("333_L5").style.fill = cube3[1][4];
	document.getElementById("333_L6").style.fill = cube3[1][5];
	document.getElementById("333_L7").style.fill = cube3[1][6];
	document.getElementById("333_L8").style.fill = cube3[1][7];
	document.getElementById("333_L9").style.fill = cube3[1][8];
	document.getElementById("333_F1").style.fill = cube3[2][0];
	document.getElementById("333_F2").style.fill = cube3[2][1];
	document.getElementById("333_F3").style.fill = cube3[2][2];
	document.getElementById("333_F4").style.fill = cube3[2][3];
	document.getElementById("333_F5").style.fill = cube3[2][4];
	document.getElementById("333_F6").style.fill = cube3[2][5];
	document.getElementById("333_F7").style.fill = cube3[2][6];
	document.getElementById("333_F8").style.fill = cube3[2][7];
	document.getElementById("333_F9").style.fill = cube3[2][8];
	document.getElementById("333_R1").style.fill = cube3[3][0];
	document.getElementById("333_R2").style.fill = cube3[3][1];
	document.getElementById("333_R3").style.fill = cube3[3][2];
	document.getElementById("333_R4").style.fill = cube3[3][3];
	document.getElementById("333_R5").style.fill = cube3[3][4];
	document.getElementById("333_R6").style.fill = cube3[3][5];
	document.getElementById("333_R7").style.fill = cube3[3][6];
	document.getElementById("333_R8").style.fill = cube3[3][7];
	document.getElementById("333_R9").style.fill = cube3[3][8];
	document.getElementById("333_B1").style.fill = cube3[4][0];
	document.getElementById("333_B2").style.fill = cube3[4][1];
	document.getElementById("333_B3").style.fill = cube3[4][2];
	document.getElementById("333_B4").style.fill = cube3[4][3];
	document.getElementById("333_B5").style.fill = cube3[4][4];
	document.getElementById("333_B6").style.fill = cube3[4][5];
	document.getElementById("333_B7").style.fill = cube3[4][6];
	document.getElementById("333_B8").style.fill = cube3[4][7];
	document.getElementById("333_B9").style.fill = cube3[4][8];
	document.getElementById("333_D1").style.fill = cube3[5][0];
	document.getElementById("333_D2").style.fill = cube3[5][1];
	document.getElementById("333_D3").style.fill = cube3[5][2];
	document.getElementById("333_D4").style.fill = cube3[5][3];
	document.getElementById("333_D5").style.fill = cube3[5][4];
	document.getElementById("333_D6").style.fill = cube3[5][5];
	document.getElementById("333_D7").style.fill = cube3[5][6];
	document.getElementById("333_D8").style.fill = cube3[5][7];
	document.getElementById("333_D9").style.fill = cube3[5][8];
}