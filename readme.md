# Treehom game

Click on the diagonal lines to change their orientation. Goal is to make all lines connect to only one color.

# Background

I came up with this game when thinking about homomorphisms from grids into trees. First, ignore the colors. Every homomorphism from a grid into a tree must collapse every grid cell. You can think of a diagonal line in a grid cell as merging the two grid points that are connected by this diagonal line into a single point. So if you draw a diagonal line into every grid cell, this describes a tree-shaped homomorphic image of the grid.

For the game, we additionally color some of the grid points and ask whether there is a homomorphism from the grid into some tree such that no two grid cells with different colors are mapped to the same points.

I am interested in the complexity of deciding whether a solution to a given field exists, i.e. given a grid where some of the grid points are colored, does there exist a homomorphism from the grid into a tree such that no two points with different colors are mapped to the same point? Even though the game has similarities to many NP complete logic puzzles, it seems to be in P. But I don't have a proof. Let me know if you find a proof. 
