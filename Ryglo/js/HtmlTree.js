(function(window){
	if(!window.d3){
		console.error("D3가 없습니다.");
		return false;
	}
	var d3 = window.d3;
	d3.D2VO ={};

	d3.D2VO.tree = {
		draw : function(_param){
			_param = _param === undefined ? {} : _param;
			var option = {
				width: _param.width || 100,
				height:_param.height || 100,
				rootId : _param.rootId ? '#'+_param.rootId : 'body',
				targetId : _param.targetId ? '#'+_param.targetId : 'body',
			};

			var getChildren = function nextNode(_dom){
				var i = 0 ;
				var max = _dom.children.length;
				var children = [];
				for(i ; i < max ;i++){
					if(_dom.children[i].tagName === 'SCRIPT'){
						continue;
					}
					children.push(nextNode(_dom.children[i]));
				}
				return {
					name : _dom.tagName.toLowerCase() + (_dom.id ? ('#'+_dom.id) : '') ,
					children : children,
				}
			}
			var treePadding = 30;
			var d3_body = d3.select(option.rootId);
			var rootElement = getChildren(d3_body.node());

			var tree = d3.layout.tree().size([option.width - treePadding ,option.height- treePadding]);

			var nodes = tree(rootElement);
			var links = tree.links(nodes);

			var container = d3.select(option.targetId).append('svg')
				.attr('width',option.width).attr('height',option.width)
				.append('g').attr('class','tree')
				.attr('transform','translate(0,10)');

			var diagonal = d3.svg.diagonal().projection(function(d){return [d.x,d.y];});

			var d3_link = container.selectAll('path.link')
					.data(links)
					.enter()
					.append('path').attr('class','link')
					.attr('d',diagonal)
					.style({
						fill:'none',
						stroke:'black',
					});

			var d3_node = container.selectAll('circle.node')
				.data(nodes)
				.enter()
				.append('g')
				.attr({
					class: 'node',
					transform :function(d){ return 'translate('+d.x+','+d.y+')';},
				});


			d3_node.append('circle').attr('class','nodeCircle')
				.attr({
					r : 5,
				})
				.style({
					fill:'red',
				});
			d3_node.append('text').attr('class','nodeText')
				.text(function(d){return d.name;})
				.attr({
					'text-anchor':'start',
					dx : 7,
					dy : 5
				})
				.style({
					'font-size':'.5em',
					'font-family':'sans-serif',
				});
		},//end draw

	}



})(window,undefined)