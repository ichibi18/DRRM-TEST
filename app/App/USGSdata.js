Ext.define('MyPath.USGSdata',{
	extend:'Ext.window.Window',
	alias:'widget.USGSdata',
	title:'Eartquake data (USGS)',
	width:250,
	mappanel:'',
	buildButtons:function(){
		return[{
				xtype:'button',				
				itemId:'Ok',
				text:'Ok',
				handler:function(){
					var me = this.up('panel')
					var Option =me.getComponent('rg1').getValue()					
					var url
					
					switch(Option.Option){
					case '1':						
						url="http://localhost:3000/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom"
						break
					case '2':
						url="http://localhost:3000/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.atom" 
						break
					case '3':
						url="http://localhost:3000/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.atom" 
						break	
					case '4':
						url="http://localhost:3000/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.atom" 
						break	
					}
					//console.log(Option.Option);
					//console.log(url);
					
										
					//
					if (map.getLayersByName('Earthquakes (USGS)').length>0)	{
						map.getLayersByName('Earthquakes (USGS)')[0].destroy();		
					}
		
					var usgs = new OpenLayers.Layer.Vector("Earthquakes (USGS)", {
						projection: new OpenLayers.Projection("EPSG:4326"),
						strategies: [new OpenLayers.Strategy.Fixed()],
						protocol: new OpenLayers.Protocol.HTTP({											
							url:url,								
							format: new OpenLayers.Format.GeoRSS()
						}),
						styleMap: new OpenLayers.StyleMap({'default':{
							externalGraphic: "/app/chooser/icons/Equake.png",				
							graphicYOffset: -25,
							graphicHeight: 20,
							
						}}) ,
					});
					console.log(url);
					me.mappanel.map.addLayer(usgs);
					//console.log(me.mappanel.map);
					me.close()
					//
				
				}	
			},
			{
				xtype:'button',				
				itemId:'Close',
				text:'Close',	
				handler:function(){
					var me =this.up('panel');				
					me.close();				
				}	
			
			}
		
		
		]
	
	},
	buildItems:function(){
		return[{
			xtype: 'radiogroup',	
			itemId:'rg1',	
			height:130,	
			columns:1,
			items:[{
				boxLabel: 'Earthquake for the past hour',
				checked:true,
                name: 'Option',
                inputValue: '1'				
				
			},
			{
				boxLabel: 'Earthquake for the past day',
                name: 'Option',
                inputValue: '2'				
				
			},
			{
				boxLabel: 'Earthquake for the past week',
                name: 'Option',
                inputValue: '3'								
				
			},
			{
				boxLabel: 'Earthquake for the past month',
                name: 'Option',
                inputValue: '4'				
				
			}
			],
			
			
			
			
		}]
	
	},
	initComponent:function(){
		this.items = this.buildItems();
		this.buttons=this.buildButtons();
	
this.callParent();	
	}
	
	


});