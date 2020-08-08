
var cubeP = [[r, r, r, r, r, r, r, r, r],
			 [g, g, g, g, g, g, g, g, g],
			 [b, b, b, b, b, b, b, b, b],
			 [y, y, y, y, y, y, y, y, y]];

/* l1 l2 l3 l4 l5     f1     r1 r2 r3 r4 r5

	   l6 l7 l8     f2 f3 f4     r6 r7 r8

	      l9     f5 f6 f7 f8 f9     r9


	             d1 d2 d3 d4 d5

	                d6 d7 d8

	                   d9
*/

function drawCubeP(scram) {
	initCubeArr("pyram");

	let scr = getSequence("3", scram);
	let temp;
	
	for (let i = 0; i < scr.length; i++) {
		switch (scr[i]) {
			case "R":
				temp = cubeP[1][3];
				cubeP[1][3] = cubeP[3][2];
				cubeP[3][2] = cubeP[2][7];
				cubeP[2][7] = temp;

				temp = cubeP[1][6];
				cubeP[1][6] = cubeP[3][7];
				cubeP[3][7] = cubeP[2][5];
				cubeP[2][5] = temp;

				temp = cubeP[1][7];
				cubeP[1][7] = cubeP[3][3];
				cubeP[3][3] = cubeP[2][6];
				cubeP[2][6] = temp;

				temp = cubeP[1][8];
				cubeP[1][8] = cubeP[3][4];
				cubeP[3][4] = cubeP[2][8];
				cubeP[2][8] = temp;
				break;

			case "L":
				temp = cubeP[1][1];
				cubeP[1][1] = cubeP[0][5];
				cubeP[0][5] = cubeP[3][2];
				cubeP[3][2] = temp;

				temp = cubeP[1][6];
				cubeP[1][6] = cubeP[0][7];
				cubeP[0][7] = cubeP[3][5];
				cubeP[3][5] = temp;

				temp = cubeP[1][5];
				cubeP[1][5] = cubeP[0][6];
				cubeP[0][6] = cubeP[3][1];
				cubeP[3][1] = temp;

				temp = cubeP[1][4];
				cubeP[1][4] = cubeP[0][8];
				cubeP[0][8] = cubeP[3][0];
				cubeP[3][0] = temp;
				break;

			case "U":
				temp = cubeP[1][1];
				cubeP[1][1] = cubeP[2][5];
				cubeP[2][5] = cubeP[0][2];
				cubeP[0][2] = temp;

				temp = cubeP[1][3];
				cubeP[1][3] = cubeP[2][2];
				cubeP[2][2] = cubeP[0][7];
				cubeP[0][7] = temp;

				temp = cubeP[1][2];
				cubeP[1][2] = cubeP[2][1];
				cubeP[2][1] = cubeP[0][3];
				cubeP[0][3] = temp;

				temp = cubeP[1][0];
				cubeP[1][0] = cubeP[2][0];
				cubeP[2][0] = cubeP[0][4];
				cubeP[0][4] = temp;
				break;

			case "B":
				temp = cubeP[2][2];
				cubeP[2][2] = cubeP[3][7];
				cubeP[3][7] = cubeP[0][5];
				cubeP[0][5] = temp;

				temp = cubeP[2][7];
				cubeP[2][7] = cubeP[3][5];
				cubeP[3][5] = cubeP[0][2];
				cubeP[0][2] = temp;

				temp = cubeP[2][3];
				cubeP[2][3] = cubeP[3][6];
				cubeP[3][6] = cubeP[0][1];
				cubeP[0][1] = temp;

				temp = cubeP[2][4];
				cubeP[2][4] = cubeP[3][8];
				cubeP[3][8] = cubeP[0][0];
				cubeP[0][0] = temp;
				break;

			case "r":
				temp = cubeP[1][8];
				cubeP[1][8] = cubeP[3][4];
				cubeP[3][4] = cubeP[2][8];
				cubeP[2][8] = temp;
				break;

			case "l":
				temp = cubeP[1][4];
				cubeP[1][4] = cubeP[0][8];
				cubeP[0][8] = cubeP[3][0];
				cubeP[3][0] = temp;
				break;

			case "u":
				temp = cubeP[1][0];
				cubeP[1][0] = cubeP[2][0];
				cubeP[2][0] = cubeP[0][4];
				cubeP[0][4] = temp;
				break;

			case "b":
				temp = cubeP[2][4];
				cubeP[2][4] = cubeP[3][8];
				cubeP[3][8] = cubeP[0][0];
				cubeP[0][0] = temp;
				break;
		}
	}
	document.getElementById("pyram_L1").style.fill = cubeP[0][0];
	document.getElementById("pyram_L2").style.fill = cubeP[0][1];
	document.getElementById("pyram_L3").style.fill = cubeP[0][2];
	document.getElementById("pyram_L4").style.fill = cubeP[0][3];
	document.getElementById("pyram_L5").style.fill = cubeP[0][4];
	document.getElementById("pyram_L6").style.fill = cubeP[0][5];
	document.getElementById("pyram_L7").style.fill = cubeP[0][6];
	document.getElementById("pyram_L8").style.fill = cubeP[0][7];
	document.getElementById("pyram_L9").style.fill = cubeP[0][8];
	document.getElementById("pyram_F1").style.fill = cubeP[1][0];
	document.getElementById("pyram_F2").style.fill = cubeP[1][1];
	document.getElementById("pyram_F3").style.fill = cubeP[1][2];
	document.getElementById("pyram_F4").style.fill = cubeP[1][3];
	document.getElementById("pyram_F5").style.fill = cubeP[1][4];
	document.getElementById("pyram_F6").style.fill = cubeP[1][5];
	document.getElementById("pyram_F7").style.fill = cubeP[1][6];
	document.getElementById("pyram_F8").style.fill = cubeP[1][7];
	document.getElementById("pyram_F9").style.fill = cubeP[1][8];
	document.getElementById("pyram_R1").style.fill = cubeP[2][0];
	document.getElementById("pyram_R2").style.fill = cubeP[2][1];
	document.getElementById("pyram_R3").style.fill = cubeP[2][2];
	document.getElementById("pyram_R4").style.fill = cubeP[2][3];
	document.getElementById("pyram_R5").style.fill = cubeP[2][4];
	document.getElementById("pyram_R6").style.fill = cubeP[2][5];
	document.getElementById("pyram_R7").style.fill = cubeP[2][6];
	document.getElementById("pyram_R8").style.fill = cubeP[2][7];
	document.getElementById("pyram_R9").style.fill = cubeP[2][8];
	document.getElementById("pyram_D1").style.fill = cubeP[3][0];
	document.getElementById("pyram_D2").style.fill = cubeP[3][1];
	document.getElementById("pyram_D3").style.fill = cubeP[3][2];
	document.getElementById("pyram_D4").style.fill = cubeP[3][3];
	document.getElementById("pyram_D5").style.fill = cubeP[3][4];
	document.getElementById("pyram_D6").style.fill = cubeP[3][5];
	document.getElementById("pyram_D7").style.fill = cubeP[3][6];
	document.getElementById("pyram_D8").style.fill = cubeP[3][7];
	document.getElementById("pyram_D9").style.fill = cubeP[3][8];
}