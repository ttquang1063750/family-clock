# Family Clock (Canvas)
````
 <div class="container">
    <canvas id="clock"></canvas>
</div>
<script src="Vector.js"></script>
<script src="clock.js"></script>
<script>
    new ClockComponent(document.getElementById('clock'), [
        {
            name: 'second',
            url: 'images/son.png'
        },
        {
            name: 'minute',
            url: 'images/mom.png'
        },
        {
            name: 'hour',
            url: 'images/dad.png'
        }
    ])
</script>
```
