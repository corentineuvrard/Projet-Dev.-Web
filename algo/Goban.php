<?php
  require_once('Data.php');
  header("Content-type: image/svg+xml");
  print('<?xml version="1.0" standalone="no"?>');
  print('<?xml-stylesheet type="text/css" href="goban.css"?>')
?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<?php echo '<svg onload="init()" width="800" height="800" viewBox="-10 -10 '.(($size*10)+10).' '.(($size*10)+10).'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' ?>
  <desc>Construction de la grille</desc>
    <defs>
      <pattern id="bg" patternUnits="userSpaceOnUse" width="100" height="100">
      <?php $grille->getBackground(); ?>
      </pattern>
      <?php $grille->getD();?>
    </defs>

    <g id="goban">
      <use  xlink:href="#traits"/>
      <g id="label">
        <?php $grille->getXLabels();?>
        <?php $grille->getYLabels();?>
      </g>
      <g id="grid" >
        <?php $grille->getDots();?>
        <?php echo '<use transform="translate('.($grille->getSize()*10-10).',0) rotate(90)" xlink:href="#traits" />' ?>
      </g>
      <g id="skip_button">
      	<?php echo '<rect x="'.(((($size*10)+10)/2)-20).'" y="'.(($size*10)-6).'" width="20" height="5" fill-opacity="0" stroke="black" stroke-width="0.3" />' ?>
      	<?php echo '<text x="'.(((($size*10)+10)/2)-15).'" y="'.(($size*10)-2).'" font-family="Arial, Helvetica, sans-serif" font-size="4">SKIP</text>' ?>
      </g>
    </g>

    <script xlink:href="Pierre.js"></script>
</svg>